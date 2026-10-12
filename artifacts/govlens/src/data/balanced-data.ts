/**
 * Balanced-evidence data
 * ─────────────────────────────────────────────────────────────────────────────
 * Three datasets that sit beside the PIB-vs-CAG material so that audit findings
 * are never read in isolation:
 *
 *   1. TERMS               — government terms, used as neutral shaded bands.
 *   2. TREND_INDICATORS    — long series that start BEFORE 2014, so direction of
 *                            travel can be compared across terms.
 *   3. OUTCOME_ROWS        — independent household-survey results (NFHS) linked to
 *                            the schemes they relate to.
 *   4. SOURCE_GROUPS       — the public sources the platform relies on.
 *
 * Rules followed in this file (see /methodology):
 *   - Every series cites a published source and links to it.
 *   - Different survey designs are never joined into one line.
 *   - Survey rounds are NOT attributed to a single government: policies act with
 *     a lag and survey fieldwork spans years.
 *   - "year" is the calendar year, or the START year of a financial year
 *     (FY 2013-14 → 2013). Survey rounds use the mid-point of fieldwork.
 *
 * Figures were compiled from the cited publications. Each entry links to its
 * source so it can be checked; corrections are welcome via "Report an issue".
 */

export type Direction = 'higher-better' | 'lower-better';

// ─── 1. Government terms ─────────────────────────────────────────────────────

export interface Term {
  id: string;
  label: string;
  /** inclusive start year (calendar year / FY start year) */
  from: number;
  /** exclusive end year */
  to: number;
  alliance: string;
}

export const TERMS: Term[] = [
  { id: 'upa1', label: 'UPA-I',  from: 2004, to: 2009, alliance: 'UPA (May 2004 – May 2009)' },
  { id: 'upa2', label: 'UPA-II', from: 2009, to: 2014, alliance: 'UPA (May 2009 – May 2014)' },
  { id: 'nda1', label: 'NDA-I',  from: 2014, to: 2019, alliance: 'NDA (May 2014 – May 2019)' },
  { id: 'nda2', label: 'NDA-II', from: 2019, to: 2024, alliance: 'NDA (May 2019 – Jun 2024)' },
  { id: 'nda3', label: 'NDA-III', from: 2024, to: 2030, alliance: 'NDA (Jun 2024 – )' },
];

/** Year used to split "before" and "since" in annual series. */
export const SPLIT_YEAR = 2014;

// ─── 2. Long series ──────────────────────────────────────────────────────────

export type TrendArea = 'Health' | 'Economy' | 'Jobs' | 'Poverty' | 'Environment';

export interface TrendPoint {
  year: number;
  value: number;
  /** shown in tooltip, e.g. "NFHS-4 (2015-16)" */
  label?: string;
}

export interface TrendIndicator {
  id: string;
  title: string;
  area: TrendArea;
  unit: string;
  direction: Direction;
  /** annual → year-on-year series; survey → a few survey rounds */
  kind: 'annual' | 'survey';
  decimals: number;
  points: TrendPoint[];
  source: string;
  sourceUrl: string;
  /** what a careful reader should keep in mind */
  caveat: string;
}

export const TREND_INDICATORS: TrendIndicator[] = [
  {
    id: 'imr',
    title: 'Infant mortality rate',
    area: 'Health',
    unit: 'per 1,000 live births',
    direction: 'lower-better',
    kind: 'annual',
    decimals: 0,
    points: [
      { year: 2004, value: 58 }, { year: 2005, value: 58 }, { year: 2006, value: 57 },
      { year: 2007, value: 55 }, { year: 2008, value: 53 }, { year: 2009, value: 50 },
      { year: 2010, value: 47 }, { year: 2011, value: 44 }, { year: 2012, value: 42 },
      { year: 2013, value: 40 }, { year: 2014, value: 39 }, { year: 2015, value: 37 },
      { year: 2016, value: 34 }, { year: 2017, value: 33 }, { year: 2018, value: 32 },
      { year: 2019, value: 30 }, { year: 2020, value: 28 }, { year: 2021, value: 27 },
      { year: 2022, value: 26 },
    ],
    source: 'Sample Registration System (SRS), Registrar General of India',
    sourceUrl: 'https://censusindia.gov.in',
    caveat: 'Falling steadily in every term. The pace is faster before 2014 in absolute points per year; levels are lower after, so each point is harder to gain.',
  },
  {
    id: 'mmr',
    title: 'Maternal mortality ratio',
    area: 'Health',
    unit: 'per 1,00,000 live births',
    direction: 'lower-better',
    kind: 'annual',
    decimals: 0,
    points: [
      { year: 2002, value: 301, label: '2001-03' }, { year: 2005, value: 254, label: '2004-06' },
      { year: 2008, value: 212, label: '2007-09' }, { year: 2011, value: 178, label: '2010-12' },
      { year: 2012, value: 167, label: '2011-13' }, { year: 2013, value: 167, label: '2012-14' },
      { year: 2014, value: 140, label: '2013-15' }, { year: 2015, value: 130, label: '2014-16' },
      { year: 2016, value: 122, label: '2015-17' }, { year: 2017, value: 113, label: '2016-18' },
      { year: 2018, value: 103, label: '2017-19' }, { year: 2019, value: 97, label: '2018-20' },
    ],
    source: 'SRS Special Bulletins on Maternal Mortality, Registrar General of India',
    sourceUrl: 'https://censusindia.gov.in',
    caveat: 'Each value pools three years of data and is plotted at the middle year, so it cannot be tied to a single year or government.',
  },
  {
    id: 'stunting',
    title: 'Children under 5 who are stunted',
    area: 'Health',
    unit: '% of children',
    direction: 'lower-better',
    kind: 'survey',
    decimals: 1,
    points: [
      { year: 2005.5, value: 48.0, label: 'NFHS-3 (2005-06)' },
      { year: 2015.5, value: 38.4, label: 'NFHS-4 (2015-16)' },
      { year: 2020, value: 35.5, label: 'NFHS-5 (2019-21)' },
    ],
    source: 'National Family Health Survey (NFHS-3, 4, 5), IIPS / Ministry of Health',
    sourceUrl: 'https://rchiips.org/nfhs/',
    caveat: 'NFHS-6 (2023-24) fact sheets were published in June 2026; add them here once checked against the release. NFHS-2 used a different growth reference and is left out.',
  },
  {
    id: 'anaemia-women',
    title: 'Women aged 15-49 who are anaemic',
    area: 'Health',
    unit: '% of women',
    direction: 'lower-better',
    kind: 'survey',
    decimals: 1,
    points: [
      { year: 2005.5, value: 55.3, label: 'NFHS-3 (2005-06)' },
      { year: 2015.5, value: 53.1, label: 'NFHS-4 (2015-16)' },
      { year: 2020, value: 57.0, label: 'NFHS-5 (2019-21)' },
    ],
    source: 'National Family Health Survey (NFHS-3, 4, 5), IIPS / Ministry of Health',
    sourceUrl: 'https://rchiips.org/nfhs/',
    caveat: 'A measure that got worse between the two most recent rounds. Included deliberately: a balanced view shows setbacks as well as gains.',
  },
  {
    id: 'oope',
    title: 'Out-of-pocket spending as share of health spending',
    area: 'Health',
    unit: '% of total health expenditure',
    direction: 'lower-better',
    kind: 'annual',
    decimals: 1,
    points: [
      { year: 2013, value: 64.2 }, { year: 2014, value: 62.6 }, { year: 2015, value: 60.6 },
      { year: 2016, value: 58.7 }, { year: 2017, value: 48.8 }, { year: 2018, value: 48.2 },
      { year: 2019, value: 47.1 }, { year: 2020, value: 44.4 }, { year: 2021, value: 39.4 },
    ],
    source: 'National Health Accounts estimates, Ministry of Health & Family Welfare',
    sourceUrl: 'https://mohfw.gov.in',
    caveat: 'Years are financial-year start (2013 = FY 2013-14). The drop between FY2016-17 and FY2017-18 partly reflects a change in estimation method, so treat that single step with caution. No comparable pre-2013 series is shown.',
  },
  {
    id: 'fiscal-deficit',
    title: "Union government's fiscal deficit",
    area: 'Economy',
    unit: '% of GDP',
    direction: 'lower-better',
    kind: 'annual',
    decimals: 1,
    points: [
      { year: 2004, value: 3.9 }, { year: 2005, value: 4.0 }, { year: 2006, value: 3.3 },
      { year: 2007, value: 2.5 }, { year: 2008, value: 6.0 }, { year: 2009, value: 6.5 },
      { year: 2010, value: 4.8 }, { year: 2011, value: 5.9 }, { year: 2012, value: 4.9 },
      { year: 2013, value: 4.4 }, { year: 2014, value: 4.1 }, { year: 2015, value: 3.9 },
      { year: 2016, value: 3.5 }, { year: 2017, value: 3.5 }, { year: 2018, value: 3.4 },
      { year: 2019, value: 4.6 }, { year: 2020, value: 9.2 }, { year: 2021, value: 6.7 },
      { year: 2022, value: 6.4 }, { year: 2023, value: 5.6 }, { year: 2024, value: 4.8 },
    ],
    source: 'Union Budget documents / Controller General of Accounts',
    sourceUrl: 'https://www.indiabudget.gov.in',
    caveat: 'Years are financial-year start (2008 = FY 2008-09). Both 2008-09 and 2020-21 spikes followed global shocks (financial crisis, pandemic). Later GDP base revisions shift the ratio slightly.',
  },
  {
    id: 'mpi',
    title: 'People in multidimensional poverty (national MPI)',
    area: 'Poverty',
    unit: '% of population',
    direction: 'lower-better',
    kind: 'survey',
    decimals: 2,
    points: [
      { year: 2013.5, value: 29.17, label: '2013-14 (estimate)' },
      { year: 2015.5, value: 24.85, label: 'NFHS-4 (2015-16)' },
      { year: 2020, value: 14.96, label: 'NFHS-5 (2019-21)' },
      { year: 2022.5, value: 11.28, label: '2022-23 (projection)' },
    ],
    source: 'NITI Aayog, National Multidimensional Poverty Index reports and 2024 discussion paper',
    sourceUrl: 'https://www.niti.gov.in',
    caveat: 'The 2013-14 and 2022-23 points are NITI Aayog model estimates, not survey rounds. Income-poverty and international (World Bank) measures use different definitions and give different levels.',
  },
  {
    id: 'unemployment',
    title: 'Unemployment rate (usual status, all ages)',
    area: 'Jobs',
    unit: '% of labour force',
    direction: 'lower-better',
    kind: 'annual',
    decimals: 1,
    points: [
      { year: 2017, value: 6.0 }, { year: 2018, value: 5.8 }, { year: 2019, value: 4.8 },
      { year: 2020, value: 4.2 }, { year: 2021, value: 4.1 }, { year: 2022, value: 3.2 },
      { year: 2023, value: 3.2 },
    ],
    source: 'Periodic Labour Force Survey (PLFS) Annual Reports, MoSPI',
    sourceUrl: 'https://www.mospi.gov.in',
    caveat: 'Years are survey-year start (2017 = July 2017 – June 2018). PLFS began in 2017-18; the older NSS employment surveys used a different design, so no pre-2017 comparison is drawn. PLFS is now monthly; use the MoSPI API for the latest.',
  },
  {
    id: 'female-lfpr',
    title: 'Women in the labour force (age 15+)',
    area: 'Jobs',
    unit: '% of women 15+',
    direction: 'higher-better',
    kind: 'annual',
    decimals: 1,
    points: [
      { year: 2017, value: 23.3 }, { year: 2018, value: 24.5 }, { year: 2019, value: 30.0 },
      { year: 2020, value: 32.5 }, { year: 2021, value: 32.8 }, { year: 2022, value: 37.0 },
      { year: 2023, value: 41.7 },
    ],
    source: 'Periodic Labour Force Survey (PLFS) Annual Reports, MoSPI',
    sourceUrl: 'https://www.mospi.gov.in',
    caveat: 'Much of the rise is unpaid work on family farms and enterprises, which counts as participation. Same survey-design limit as above.',
  },
  {
    id: 'forest',
    title: 'Forest cover',
    area: 'Environment',
    unit: '% of geographical area',
    direction: 'higher-better',
    kind: 'annual',
    decimals: 2,
    points: [
      { year: 2009, value: 21.02 }, { year: 2011, value: 21.05 }, { year: 2013, value: 21.23 },
      { year: 2015, value: 21.34 }, { year: 2017, value: 21.54 }, { year: 2019, value: 21.67 },
      { year: 2021, value: 21.71 }, { year: 2023, value: 21.76 },
    ],
    source: 'India State of Forest Report (ISFR), Forest Survey of India',
    sourceUrl: 'https://fsi.nic.in',
    caveat: 'Forest cover includes plantations and orchards, so it is not the same as natural forest. Assessments are every two years; the national target is 33%.',
  },
];

// ─── 3. Independent outcomes (NFHS-4 → NFHS-5) ───────────────────────────────

export type OutcomeArea = 'Sanitation & water' | 'Energy' | 'Finance' | 'Health' | 'Nutrition' | 'Women & girls';

export interface OutcomeRow {
  id: string;
  area: OutcomeArea;
  indicator: string;
  unit: string;
  direction: Direction;
  /** NFHS-4, 2015-16 */
  earlier: number;
  /** NFHS-5, 2019-21 */
  later: number;
  decimals: number;
  /** slugs of schemes (see /schemes) this indicator relates to */
  schemeSlugs: string[];
  note?: string;
}

export const OUTCOME_SOURCE = {
  name: 'NFHS-4 (2015-16) and NFHS-5 (2019-21) national reports, IIPS / Ministry of Health & Family Welfare',
  url: 'https://rchiips.org/nfhs/',
  earlierLabel: 'NFHS-4 (2015-16)',
  laterLabel: 'NFHS-5 (2019-21)',
  caveat:
    'A household survey shows how the whole country changed between two rounds. It does not isolate what one scheme did, and it does not show whether audit findings about that scheme are right or wrong. Read it next to the audit findings, not instead of them.',
};

export const OUTCOME_ROWS: OutcomeRow[] = [
  { id: 'sanitation', area: 'Sanitation & water', indicator: 'Population in households with an improved sanitation facility', unit: '%', direction: 'higher-better', earlier: 48.4, later: 70.2, decimals: 1, schemeSlugs: ['swachh-bharat-gramin', 'swachh-bharat-urban'], note: 'Counts facilities, not whether people use them every day.' },
  { id: 'water', area: 'Sanitation & water', indicator: 'Population with an improved source of drinking water', unit: '%', direction: 'higher-better', earlier: 89.9, later: 95.9, decimals: 1, schemeSlugs: ['jal-jeevan'], note: 'An improved source is not the same as a tap connection at home or safe water.' },
  { id: 'cooking-fuel', area: 'Energy', indicator: 'Households using clean fuel for cooking', unit: '%', direction: 'higher-better', earlier: 43.8, later: 58.6, decimals: 1, schemeSlugs: ['pmuy'], note: 'Having a connection and refilling it regularly are different things.' },
  { id: 'electricity', area: 'Energy', indicator: 'Households with electricity', unit: '%', direction: 'higher-better', earlier: 88.0, later: 96.8, decimals: 1, schemeSlugs: ['saubhagya', 'ddugjy'] },
  { id: 'bank-account', area: 'Finance', indicator: 'Women with a bank or savings account they use themselves', unit: '%', direction: 'higher-better', earlier: 53.0, later: 78.6, decimals: 1, schemeSlugs: ['pmjdy'] },
  { id: 'insurance', area: 'Finance', indicator: 'Households with a member covered by a health insurance or financing scheme', unit: '%', direction: 'higher-better', earlier: 28.7, later: 41.0, decimals: 1, schemeSlugs: ['pmjay'], note: 'Includes state schemes and other cover, not only the central scheme.' },
  { id: 'immunisation', area: 'Health', indicator: 'Children aged 12-23 months fully vaccinated', unit: '%', direction: 'higher-better', earlier: 62.0, later: 76.4, decimals: 1, schemeSlugs: ['mission-indradhanush'] },
  { id: 'institutional-births', area: 'Health', indicator: 'Births in a health facility', unit: '%', direction: 'higher-better', earlier: 78.9, later: 88.6, decimals: 1, schemeSlugs: ['nhm'] },
  { id: 'anc4', area: 'Health', indicator: 'Mothers with 4 or more antenatal check-ups', unit: '%', direction: 'higher-better', earlier: 51.2, later: 58.1, decimals: 1, schemeSlugs: ['nhm'] },
  { id: 'stunting', area: 'Nutrition', indicator: 'Children under 5 who are stunted', unit: '%', direction: 'lower-better', earlier: 38.4, later: 35.5, decimals: 1, schemeSlugs: ['poshan-abhiyaan'] },
  { id: 'wasting', area: 'Nutrition', indicator: 'Children under 5 who are wasted', unit: '%', direction: 'lower-better', earlier: 21.0, later: 19.3, decimals: 1, schemeSlugs: ['poshan-abhiyaan'] },
  { id: 'underweight', area: 'Nutrition', indicator: 'Children under 5 who are underweight', unit: '%', direction: 'lower-better', earlier: 35.8, later: 32.1, decimals: 1, schemeSlugs: ['poshan-abhiyaan'] },
  { id: 'anaemia-children', area: 'Nutrition', indicator: 'Children aged 6-59 months who are anaemic', unit: '%', direction: 'lower-better', earlier: 58.6, later: 67.1, decimals: 1, schemeSlugs: ['poshan-abhiyaan'], note: 'Got worse. Anaemia is one of the clearest gaps between spending and results.' },
  { id: 'anaemia-women', area: 'Nutrition', indicator: 'Women aged 15-49 who are anaemic', unit: '%', direction: 'lower-better', earlier: 53.1, later: 57.0, decimals: 1, schemeSlugs: ['poshan-abhiyaan'], note: 'Got worse.' },
  { id: 'sex-ratio-birth', area: 'Women & girls', indicator: 'Sex ratio at birth (females per 1,000 males, births in last 5 years)', unit: 'per 1,000', direction: 'higher-better', earlier: 919, later: 929, decimals: 0, schemeSlugs: ['bbbp'] },
  { id: 'child-marriage', area: 'Women & girls', indicator: 'Women aged 20-24 married before age 18', unit: '%', direction: 'lower-better', earlier: 26.8, later: 23.3, decimals: 1, schemeSlugs: ['bbbp'] },
  { id: 'schooling', area: 'Women & girls', indicator: 'Women aged 15-49 with 10 or more years of schooling', unit: '%', direction: 'higher-better', earlier: 35.7, later: 41.0, decimals: 1, schemeSlugs: ['samagra-shiksha', 'bbbp'] },
];

// ─── 4. Source library ───────────────────────────────────────────────────────

export type Access = 'API' | 'Download' | 'Dashboard' | 'Manual';

export interface SourceItem {
  name: string;
  url: string;
  publisher: string;
  access: Access;
  note?: string;
}

export interface SourceGroup {
  id: string;
  title: string;
  blurb: string;
  items: SourceItem[];
}

export const SOURCE_GROUPS: SourceGroup[] = [
  {
    id: 'claims',
    title: 'What governments say they will do and have done',
    blurb: 'Claims and targets. Always compare a press release against the budget target it refers to.',
    items: [
      { name: 'Press Information Bureau (PIB)', url: 'https://pib.gov.in', publisher: 'Government of India', access: 'Download', note: 'Press releases and RSS feed. Claims, not verification.' },
      { name: 'Union Budget and Outcome Budget', url: 'https://www.indiabudget.gov.in', publisher: 'Ministry of Finance', access: 'Download', note: 'Official targets and spending by scheme.' },
      { name: 'Development Monitoring and Evaluation Office (DMEO)', url: 'https://dmeo.gov.in', publisher: 'NITI Aayog', access: 'Download', note: "The government's own evaluations of schemes." },
      { name: 'Digital Sansad (questions, committees, debates)', url: 'https://sansad.in', publisher: 'Parliament of India', access: 'Download', note: 'Ministers\' written answers and standing-committee reports.' },
    ],
  },
  {
    id: 'audit',
    title: 'Audit and oversight',
    blurb: 'Findings about process, compliance and delivery. Note the audit period: many reports span more than one government.',
    items: [
      { name: 'CAG audit reports (Union and States)', url: 'https://cag.gov.in/en/audit-report', publisher: 'Comptroller and Auditor General of India', access: 'Download', note: 'Each report prints the ministry\'s reply — read it.' },
      { name: 'Parliamentary committee reports (PAC, standing committees)', url: 'https://sansad.in', publisher: 'Parliament of India', access: 'Download', note: 'Cross-party scrutiny, including Action Taken Reports.' },
      { name: 'eCourts / National Judicial Data Grid', url: 'https://njdg.ecourts.gov.in', publisher: 'Supreme Court eCommittee', access: 'Manual', note: 'Status of court cases, used to separate allegations from convictions.' },
      { name: 'Indian Kanoon', url: 'https://indiankanoon.org', publisher: 'Independent', access: 'Manual', note: 'Search court judgments.' },
    ],
  },
  {
    id: 'delivery',
    title: 'Scheme delivery dashboards (administrative data)',
    blurb: 'Self-reported by the ministries that run the schemes. Check against a survey in the next group.',
    items: [
      { name: 'DBT Bharat', url: 'https://dbtbharat.gov.in', publisher: 'Cabinet Secretariat', access: 'Dashboard', note: 'Direct benefit transfers across schemes.' },
      { name: 'MGNREGA MIS reports', url: 'https://nreganarep.nic.in', publisher: 'Ministry of Rural Development', access: 'Dashboard' },
      { name: 'PMAY-Gramin', url: 'https://pmayg.nic.in', publisher: 'Ministry of Rural Development', access: 'Dashboard' },
      { name: 'Jal Jeevan Mission dashboard', url: 'https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx', publisher: 'Ministry of Jal Shakti', access: 'Dashboard' },
      { name: 'Ayushman Bharat PM-JAY', url: 'https://pmjay.gov.in', publisher: 'National Health Authority', access: 'Dashboard' },
      { name: 'PM-KISAN', url: 'https://pmkisan.gov.in', publisher: 'Ministry of Agriculture', access: 'Dashboard' },
      { name: 'Swachh Bharat Mission', url: 'https://sbm.gov.in', publisher: 'Ministry of Jal Shakti / MoHUA', access: 'Dashboard' },
      { name: 'PMGSY roads (OMMAS)', url: 'https://omms.nic.in', publisher: 'Ministry of Rural Development', access: 'Dashboard' },
      { name: 'Open Government Data platform', url: 'https://data.gov.in', publisher: 'Government of India', access: 'API', note: 'Free API key; thousands of datasets.' },
      { name: 'National Data & Analytics Platform (NDAP)', url: 'https://ndap.niti.gov.in', publisher: 'NITI Aayog', access: 'API', note: 'District and state indicators in one place.' },
    ],
  },
  {
    id: 'outcomes',
    title: 'Independent outcome statistics',
    blurb: 'Household surveys and registers that measure results directly. This is the evidence layer that completes the picture.',
    items: [
      { name: 'MoSPI data APIs (GDP, CPI, WPI, IIP, PLFS, ASI)', url: 'https://www.mospi.gov.in', publisher: 'Ministry of Statistics', access: 'API', note: 'API at api.mospi.gov.in. PLFS is monthly from 2025.' },
      { name: 'Microdata portal (NSS, PLFS, HCES, Time Use)', url: 'https://microdata.gov.in', publisher: 'Ministry of Statistics', access: 'Download', note: 'Unit-level data from 176+ surveys.' },
      { name: 'National Family Health Survey (NFHS)', url: 'https://rchiips.org/nfhs/', publisher: 'IIPS / Ministry of Health', access: 'Download', note: 'NFHS-6 (2023-24) fact sheets published June 2026.' },
      { name: 'Census of India and Sample Registration System', url: 'https://censusindia.gov.in', publisher: 'Registrar General of India', access: 'Download', note: 'Census 2027 is under way; 2011 remains the latest full Census.' },
      { name: 'Crime in India, Prison Statistics', url: 'https://ncrb.gov.in', publisher: 'National Crime Records Bureau', access: 'Download', note: 'Reporting rules change between years.' },
      { name: 'UDISE+ (school data)', url: 'https://udiseplus.gov.in', publisher: 'Ministry of Education', access: 'Download' },
      { name: 'ASER (learning outcomes)', url: 'https://asercentre.org', publisher: 'Pratham (independent)', access: 'Download', note: 'Compare with the government\'s own learning survey.' },
      { name: 'AISHE (higher education)', url: 'https://aishe.gov.in', publisher: 'Ministry of Education', access: 'Download' },
      { name: 'Reserve Bank database (DBIE) and Handbook of Statistics on Indian States', url: 'https://data.rbi.org.in', publisher: 'Reserve Bank of India', access: 'API', note: 'Best source for state-level series going back before 2014.' },
      { name: 'Controller General of Accounts', url: 'https://cga.nic.in', publisher: 'Ministry of Finance', access: 'Download', note: 'Monthly Union accounts.' },
      { name: 'India State of Forest Report', url: 'https://fsi.nic.in', publisher: 'Forest Survey of India', access: 'Download' },
      { name: 'Air and water quality', url: 'https://cpcb.nic.in', publisher: 'Central Pollution Control Board', access: 'Dashboard' },
    ],
  },
  {
    id: 'global',
    title: 'Cross-country comparison',
    blurb: 'Lets you ask how India compares with countries at a similar income level, not only with the best in the world.',
    items: [
      { name: 'World Development Indicators', url: 'https://data.worldbank.org', publisher: 'World Bank', access: 'API' },
      { name: 'World Economic Outlook', url: 'https://www.imf.org/en/Publications/WEO', publisher: 'IMF', access: 'Download' },
      { name: 'Human Development Reports', url: 'https://hdr.undp.org/data-center', publisher: 'UNDP', access: 'API' },
      { name: 'Global Health Observatory', url: 'https://www.who.int/data/gho', publisher: 'WHO', access: 'API' },
    ],
  },
  {
    id: 'ratings',
    title: 'Expert and perception ratings (shown separately)',
    blurb: 'These are expert or survey-based opinions, not measurements. The Indian government has publicly disputed several of them, so read each one\'s method note.',
    items: [
      { name: 'Varieties of Democracy (V-Dem)', url: 'https://v-dem.net', publisher: 'V-Dem Institute', access: 'Download' },
      { name: 'Freedom in the World / Freedom on the Net', url: 'https://freedomhouse.org', publisher: 'Freedom House', access: 'Download' },
      { name: 'World Press Freedom Index', url: 'https://rsf.org/en/index', publisher: 'Reporters Without Borders', access: 'Download' },
      { name: 'Corruption Perceptions Index', url: 'https://www.transparency.org/en/cpi', publisher: 'Transparency International', access: 'Download' },
      { name: 'Rule of Law Index', url: 'https://worldjusticeproject.org', publisher: 'World Justice Project', access: 'Download' },
      { name: 'Worldwide Governance Indicators', url: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators', publisher: 'World Bank', access: 'Download' },
    ],
  },
  {
    id: 'politicians',
    title: 'Elected representatives and elections',
    blurb: 'Cover every party and every MP and MLA, not only ministers of one government.',
    items: [
      { name: 'Candidate affidavits', url: 'https://affidavit.eci.gov.in', publisher: 'Election Commission of India', access: 'Download', note: 'Primary source for assets, education and declared cases.' },
      { name: 'Election Watch / MyNeta', url: 'https://www.myneta.info', publisher: 'ADR (independent)', access: 'Manual', note: 'Structured affidavit data. Check against the ECI original.' },
      { name: 'Association for Democratic Reforms', url: 'https://adrindia.org', publisher: 'ADR', access: 'Download', note: 'Analyses of candidates and party finances.' },
      { name: 'Election results', url: 'https://results.eci.gov.in', publisher: 'Election Commission of India', access: 'Download' },
      { name: 'Lok Dhaba', url: 'https://lokdhaba.ashoka.edu.in', publisher: 'Trivedi Centre, Ashoka University', access: 'Download', note: 'Clean election history back to 1962.' },
      { name: 'MP Track (attendance, questions, debates)', url: 'https://prsindia.org', publisher: 'PRS Legislative Research', access: 'Download' },
      { name: 'Court case status', url: 'https://ecourts.gov.in', publisher: 'Supreme Court eCommittee', access: 'Manual', note: 'Needed to tell pending cases from convictions.' },
    ],
  },
  {
    id: 'parties',
    title: 'Party manifestos and finances',
    blurb: "Read each party's promises in its own words. Party sites are listed so no party's manifesto is missing.",
    items: [
      { name: 'Bharatiya Janata Party', url: 'https://www.bjp.org', publisher: 'BJP', access: 'Download' },
      { name: 'Indian National Congress', url: 'https://www.inc.in', publisher: 'INC', access: 'Download' },
      { name: 'Aam Aadmi Party', url: 'https://aamaadmiparty.org', publisher: 'AAP', access: 'Download' },
      { name: 'All India Trinamool Congress', url: 'https://aitcofficial.org', publisher: 'AITC', access: 'Download' },
      { name: 'Communist Party of India (Marxist)', url: 'https://cpim.org', publisher: 'CPI(M)', access: 'Download' },
      { name: 'Telugu Desam Party', url: 'https://telugudesam.org', publisher: 'TDP', access: 'Download' },
      { name: 'YSR Congress Party', url: 'https://ysrcongress.com', publisher: 'YSRCP', access: 'Download' },
      { name: 'Shiv Sena', url: 'https://shivsena.org', publisher: 'Shiv Sena', access: 'Download' },
      { name: 'Electoral bond disclosure and party accounts', url: 'https://www.eci.gov.in', publisher: 'Election Commission of India', access: 'Download', note: 'Published March 2024.' },
    ],
  },
  {
    id: 'states',
    title: 'State-by-state comparison',
    blurb: 'Same yardstick for every state, whichever party governs it.',
    items: [
      { name: 'SDG India Index', url: 'https://sdgindiaindex.niti.gov.in', publisher: 'NITI Aayog', access: 'Download', note: '4th edition (2023-24).' },
      { name: 'Fiscal Health Index 2026', url: 'https://niti.gov.in/sites/default/files/2026-03/Fiscal-Health-Index-2026.pdf', publisher: 'NITI Aayog', access: 'Download', note: 'Second annual edition, March 2026.' },
      { name: 'State budget analysis', url: 'https://prsindia.org', publisher: 'PRS Legislative Research', access: 'Download' },
      { name: 'Open Budgets India', url: 'https://openbudgetsindia.org', publisher: 'CBGA', access: 'Download' },
      { name: 'Accountability Initiative budget briefs', url: 'https://accountabilityindia.in', publisher: 'Centre for Policy Research', access: 'Download' },
    ],
  },
  {
    id: 'checkers',
    title: 'Fact-checkers and wire services',
    blurb: 'For checking a claim from any side. The government\'s own fact-check unit is listed alongside independent ones.',
    items: [
      { name: 'PIB Fact Check', url: 'https://factcheck.pib.gov.in', publisher: 'Government of India', access: 'Manual', note: "The government's own fact-checking unit." },
      { name: 'Factly', url: 'https://factly.in', publisher: 'Independent', access: 'Manual' },
      { name: 'BOOM', url: 'https://www.boomlive.in', publisher: 'Independent', access: 'Manual' },
      { name: 'Newschecker', url: 'https://newschecker.in', publisher: 'Independent', access: 'Manual' },
      { name: 'Alt News', url: 'https://www.altnews.in', publisher: 'Independent', access: 'Manual' },
      { name: 'Vishvas News', url: 'https://www.vishvasnews.com', publisher: 'Independent', access: 'Manual' },
      { name: 'Press Trust of India', url: 'https://www.ptinews.com', publisher: 'Wire service', access: 'Manual' },
    ],
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Is a move from `from` to `to` an improvement for this indicator? */
export function isImprovement(direction: Direction, from: number, to: number): boolean | null {
  if (to === from) return null;
  return direction === 'higher-better' ? to > from : to < from;
}

export interface WindowRate {
  from: number;
  to: number;
  perYear: number;
  improving: boolean | null;
}

/**
 * Average change per year before and since SPLIT_YEAR for an annual series.
 * The last point before the split year is the baseline for the "since" window,
 * so the two windows join up. Returns null for a window with fewer than 2 points.
 */
export function windowRates(ind: TrendIndicator): { before: WindowRate | null; since: WindowRate | null } {
  if (ind.kind !== 'annual') return { before: null, since: null };
  const pts = [...ind.points].sort((a, b) => a.year - b.year);
  const pre = pts.filter(p => p.year < SPLIT_YEAR);
  const post = pts.filter(p => p.year >= SPLIT_YEAR);

  const make = (a: TrendPoint, b: TrendPoint): WindowRate => {
    const perYear = (b.value - a.value) / (b.year - a.year);
    return { from: a.year, to: b.year, perYear, improving: isImprovement(ind.direction, a.value, b.value) };
  };

  const before = pre.length >= 2 ? make(pre[0], pre[pre.length - 1]) : null;
  const baseline = pre.length >= 1 ? pre[pre.length - 1] : null;
  const since = baseline && post.length >= 1 ? make(baseline, post[post.length - 1]) : null;
  return { before, since };
}

export function formatValue(v: number, decimals: number): string {
  return v.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function outcomesForScheme(slug: string): OutcomeRow[] {
  return OUTCOME_ROWS.filter(r => r.schemeSlugs.includes(slug));
}

/** Short display names for schemes referenced by OUTCOME_ROWS (slugs match /schemes/:slug). */
export const SCHEME_LABELS: Record<string, string> = {
  'swachh-bharat-gramin': 'Swachh Bharat Mission (Gramin)',
  'swachh-bharat-urban': 'Swachh Bharat Mission (Urban)',
  'jal-jeevan': 'Jal Jeevan Mission',
  'pmuy': 'PM Ujjwala Yojana',
  'saubhagya': 'Saubhagya',
  'ddugjy': 'DDU Gram Jyoti Yojana',
  'pmjdy': 'Jan Dhan Yojana',
  'pmjay': 'Ayushman Bharat PM-JAY',
  'mission-indradhanush': 'Mission Indradhanush',
  'nhm': 'National Health Mission',
  'poshan-abhiyaan': 'POSHAN Abhiyaan',
  'bbbp': 'Beti Bachao Beti Padhao',
  'samagra-shiksha': 'Samagra Shiksha',
};
