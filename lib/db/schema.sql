-- Database schema (PostgreSQL 15+). Safe to run more than once.
-- Used by the API on first start (AUTO_SETUP_DB=true) and can also be pasted
-- into the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS public.categories (
    id serial PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    icon text DEFAULT 'folder' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.schemes (
    id serial PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    ministry text NOT NULL,
    launched_year integer NOT NULL,
    renamed_from text,
    category_id integer NOT NULL REFERENCES public.categories(id),
    description text NOT NULL,
    goals text NOT NULL,
    target_beneficiaries text,
    target_year integer,
    budget_crore numeric(14,2)
);

CREATE TABLE IF NOT EXISTS public.cag_audits (
    id serial PRIMARY KEY,
    scheme_id integer NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    report_year integer NOT NULL,
    report_number text NOT NULL,
    finding text NOT NULL,
    severity text DEFAULT 'major' NOT NULL,
    parameter text NOT NULL,
    claimed text,
    actual text,
    unit text,
    gap_percent numeric(8,2),
    source_url text,
    report_excerpt text
);

CREATE TABLE IF NOT EXISTS public.pib_entries (
    id serial PRIMARY KEY,
    scheme_id integer NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
    date date NOT NULL,
    headline text NOT NULL,
    summary text NOT NULL,
    claim_type text DEFAULT 'achievement' NOT NULL,
    figure text,
    figure_unit text,
    source_url text
);

CREATE TABLE IF NOT EXISTS public.cag_state_reports (
    id serial PRIMARY KEY,
    report_id text NOT NULL UNIQUE,
    report_no text NOT NULL,
    year integer NOT NULL,
    title text NOT NULL,
    state text NOT NULL,
    state_code text NOT NULL,
    ministry text NOT NULL,
    category text NOT NULL,
    severity text DEFAULT 'high' NOT NULL,
    audit_period text NOT NULL,
    date_presented text NOT NULL,
    url text NOT NULL,
    file_name text NOT NULL,
    cag_json_id integer,
    cag_state integer,
    audit_score integer DEFAULT 100 NOT NULL,
    citations_failed integer DEFAULT 0 NOT NULL,
    citations_verified integer DEFAULT 0 NOT NULL,
    compiled_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.issue_reports (
    id serial PRIMARY KEY,
    issue_type text NOT NULL,
    page_affected text,
    description text NOT NULL,
    email text,
    ip_address text,
    user_agent text,
    status text DEFAULT 'open' NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Keep the auto-generated Supabase REST API from exposing these tables.
-- The Node API connects as the database owner role, which RLS does not block.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cag_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pib_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cag_state_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_reports ENABLE ROW LEVEL SECURITY;
