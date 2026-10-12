import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';
import {
  OUTCOME_SOURCE, outcomesForScheme, formatValue, isImprovement,
  type OutcomeRow,
} from '@/data/balanced-data';
import { cn } from '@/lib/utils';

export function ChangeBadge({ row }: { row: OutcomeRow }) {
  const better = isImprovement(row.direction, row.earlier, row.later);
  const label = better === null ? 'No change' : better ? 'Improved' : 'Worsened';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium',
        better === null && 'border-gray-200 bg-gray-100 text-gray-700',
        better === true && 'border-green-200 bg-green-100 text-green-900',
        better === false && 'border-red-200 bg-red-100 text-red-900',
      )}
    >
      {label}
    </span>
  );
}

export function formatChange(row: OutcomeRow): string {
  const diff = row.later - row.earlier;
  const sign = diff > 0 ? '+' : diff < 0 ? '−' : '';
  return `${sign}${formatValue(Math.abs(diff), row.decimals)}`;
}

/** Independent survey outcomes related to one scheme. Renders nothing if none exist. */
export function SchemeOutcomes({ slug }: { slug: string }) {
  const rows = outcomesForScheme(slug);
  if (rows.length === 0) return null;

  return (
    <section
      className="bg-card border border-card-border rounded-lg p-6 mb-6"
      data-testid="section-outcomes"
    >
      <h2 className="text-xl font-bold text-foreground mb-1">Independent outcome data</h2>
      <p className="text-sm text-muted-foreground mb-4">
        What household surveys measured for the whole country, shown next to the audit findings.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Indicator</th>
              <th className="py-2 px-3 font-medium whitespace-nowrap">{OUTCOME_SOURCE.earlierLabel}</th>
              <th className="py-2 px-3 font-medium whitespace-nowrap">{OUTCOME_SOURCE.laterLabel}</th>
              <th className="py-2 px-3 font-medium">Change</th>
              <th className="py-2 pl-3 font-medium" />
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
                <td className="py-2 pl-3"><ChangeBadge row={row} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{OUTCOME_SOURCE.caveat}</p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <a
          href={OUTCOME_SOURCE.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline"
        >
          Source: NFHS <ExternalLink className="w-3 h-3" />
        </a>
        <Link href="/outcomes" className="text-primary hover:underline">See all outcome indicators</Link>
      </div>
    </section>
  );
}
