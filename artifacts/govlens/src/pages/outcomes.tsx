import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SEO } from '@/components/seo';
import { ChangeBadge, formatChange } from '@/components/scheme-outcomes';
import {
  OUTCOME_ROWS, OUTCOME_SOURCE, SCHEME_LABELS, formatValue, isImprovement,
  type OutcomeArea,
} from '@/data/balanced-data';

const AREA_ORDER: OutcomeArea[] = [
  'Sanitation & water', 'Energy', 'Finance', 'Health', 'Nutrition', 'Women & girls',
];

export default function Outcomes() {
  const { t } = useTranslation();

  const improved = OUTCOME_ROWS.filter(r => isImprovement(r.direction, r.earlier, r.later) === true).length;
  const worsened = OUTCOME_ROWS.filter(r => isImprovement(r.direction, r.earlier, r.later) === false).length;

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEO
        title={t('outcomesSeoTitle', 'Independent outcomes')}
        description="What household surveys (NFHS-4 and NFHS-5) measured for sanitation, energy, finance, health, nutrition and girls, linked to the schemes they relate to."
        path="/outcomes"
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {t('outcomesTitle', 'Independent outcomes')}
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-6">
          {t(
            'outcomesIntro',
            'Audit findings tell you how a scheme was run. Household surveys tell you what changed for people. Both belong in the picture. These are the changes between the last two rounds of the National Family Health Survey.',
          )}
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="text-3xl font-bold font-mono text-green-900">{improved}</div>
            <div className="text-sm text-green-800">indicators improved</div>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="text-3xl font-bold font-mono text-red-900">{worsened}</div>
            <div className="text-sm text-red-800">indicators worsened</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-3xl font-bold font-mono text-foreground">{OUTCOME_ROWS.length}</div>
            <div className="text-sm text-muted-foreground">indicators shown</div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 mb-8 text-sm text-muted-foreground">
          {OUTCOME_SOURCE.caveat}{' '}
          <a
            href={OUTCOME_SOURCE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            NFHS source <ExternalLink className="w-3 h-3" />
          </a>
          . NFHS-6 (2023-24) fact sheets were released in June 2026 and will be added once checked.
        </div>

        <div className="space-y-6">
          {AREA_ORDER.map(area => {
            const rows = OUTCOME_ROWS.filter(r => r.area === area);
            if (rows.length === 0) return null;
            return (
              <section key={area} className="bg-card border border-card-border rounded-lg p-5" data-testid={`outcomes-${area}`}>
                <h2 className="text-lg font-bold text-foreground mb-3">{area}</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="py-2 pr-3 font-medium">Indicator</th>
                        <th className="py-2 px-3 font-medium whitespace-nowrap">{OUTCOME_SOURCE.earlierLabel}</th>
                        <th className="py-2 px-3 font-medium whitespace-nowrap">{OUTCOME_SOURCE.laterLabel}</th>
                        <th className="py-2 px-3 font-medium">Change</th>
                        <th className="py-2 px-3 font-medium" />
                        <th className="py-2 pl-3 font-medium">Related schemes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map(row => (
                        <tr key={row.id} className="border-b border-border/60 align-top">
                          <td className="py-2 pr-3 text-foreground">
                            {row.indicator}
                            {row.note && <div className="text-xs text-muted-foreground mt-0.5">{row.note}</div>}
                          </td>
                          <td className="py-2 px-3 font-mono whitespace-nowrap">{formatValue(row.earlier, row.decimals)}{row.unit === '%' ? '%' : ''}</td>
                          <td className="py-2 px-3 font-mono whitespace-nowrap">{formatValue(row.later, row.decimals)}{row.unit === '%' ? '%' : ''}</td>
                          <td className="py-2 px-3 font-mono whitespace-nowrap">{formatChange(row)}</td>
                          <td className="py-2 px-3"><ChangeBadge row={row} /></td>
                          <td className="py-2 pl-3">
                            <div className="flex flex-col gap-0.5">
                              {row.schemeSlugs.map(slug => (
                                <Link key={slug} href={`/schemes/${slug}`} className="text-primary hover:underline text-xs">
                                  {SCHEME_LABELS[slug] ?? slug}
                                </Link>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
