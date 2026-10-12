import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Search } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SEO } from '@/components/seo';
import { cn } from '@/lib/utils';
import { SOURCE_GROUPS, type Access } from '@/data/balanced-data';

const ACCESS_STYLE: Record<Access, string> = {
  API: 'border-blue-200 bg-blue-50 text-blue-900',
  Download: 'border-gray-200 bg-gray-100 text-gray-800',
  Dashboard: 'border-amber-200 bg-amber-50 text-amber-900',
  Manual: 'border-purple-200 bg-purple-50 text-purple-900',
};

export default function Sources() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SOURCE_GROUPS;
    return SOURCE_GROUPS
      .map(g => ({
        ...g,
        items: g.items.filter(i =>
          `${i.name} ${i.publisher} ${i.note ?? ''} ${i.access}`.toLowerCase().includes(q),
        ),
      }))
      .filter(g => g.items.length > 0);
  }, [query]);

  const total = SOURCE_GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEO
        title={t('sourcesSeoTitle', 'Sources')}
        description="Every public source behind the platform: government records, audits, independent surveys, election data, party manifestos and fact-checkers."
        path="/sources"
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {t('sourcesTitle', 'Sources')}
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-6">
          {t(
            'sourcesIntro',
            'All data comes from public records. Sources are grouped by what they can and cannot tell you, so a government claim, an audit, a household survey and an expert rating are never mixed up. The list spans every party and government on purpose.',
          )}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-6">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${total} sources`}
              aria-label="Search sources"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-muted-foreground self-center">How to get the data:</span>
            {(Object.keys(ACCESS_STYLE) as Access[]).map(a => (
              <span key={a} className={cn('rounded border px-2 py-0.5 font-medium', ACCESS_STYLE[a])}>{a}</span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {groups.map(group => (
            <section key={group.id} className="bg-card border border-card-border rounded-lg p-5" data-testid={`sources-${group.id}`}>
              <h2 className="text-lg font-bold text-foreground">{group.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 mb-3">{group.blurb}</p>
              <ul className="divide-y divide-border/60">
                {group.items.map(item => (
                  <li key={`${group.id}-${item.name}`} className="py-2.5 flex flex-wrap items-start gap-x-3 gap-y-1">
                    <div className="flex-1 min-w-[220px]">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {item.name} <ExternalLink className="w-3 h-3" />
                      </a>
                      <div className="text-xs text-muted-foreground">
                        {item.publisher}{item.note ? ` · ${item.note}` : ''}
                      </div>
                    </div>
                    <span className={cn('rounded border px-2 py-0.5 text-xs font-medium', ACCESS_STYLE[item.access])}>
                      {item.access}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground">No sources match “{query}”.</p>
          )}
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          Government portals move pages often. If a link is broken, use{' '}
          <a href="/report-issue" className="text-primary hover:underline">Report an issue</a> and it will be fixed.
        </p>
      </div>
    </div>
  );
}
