import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea,
} from 'recharts';
import { ExternalLink, Info } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { SEO } from '@/components/seo';
import { cn } from '@/lib/utils';
import {
  TERMS, TREND_INDICATORS, SPLIT_YEAR, formatValue, isImprovement, windowRates,
  type TrendIndicator, type TrendArea, type TrendPoint, type WindowRate,
} from '@/data/balanced-data';

const AREAS: Array<'All' | TrendArea> = ['All', 'Health', 'Economy', 'Jobs', 'Poverty', 'Environment'];

function Direction({ improving }: { improving: boolean | null }) {
  if (improving === null) return <span className="text-muted-foreground">no change</span>;
  return improving
    ? <span className="font-medium text-green-700 dark:text-green-400">improving</span>
    : <span className="font-medium text-red-700 dark:text-red-400">worsening</span>;
}

function TrendTip({
  active, payload, ind,
}: { active?: boolean; payload?: Array<{ payload: TrendPoint }>; ind: TrendIndicator }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md">
      <div className="font-semibold text-foreground">{p.label ?? Math.round(p.year)}</div>
      <div className="font-mono text-foreground">
        {formatValue(p.value, ind.decimals)} <span className="text-muted-foreground">{ind.unit}</span>
      </div>
    </div>
  );
}

function TrendChart({ ind }: { ind: TrendIndicator }) {
  const xs = ind.points.map(p => p.year);
  const min = Math.floor(Math.min(...xs));
  const max = Math.ceil(Math.max(...xs));
  const vals = ind.points.map(p => p.value);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const pad = (hi - lo) * 0.2 || 1;
  const yDomain: [number, number] = [Math.floor(lo - pad), Math.ceil(hi + pad)];

  return (
    <ResponsiveContainer width="100%" height={230}>
      <LineChart data={ind.points} margin={{ top: 20, right: 14, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        {TERMS.map((term, i) => {
          const x1 = Math.max(term.from, min);
          const x2 = Math.min(term.to, max);
          if (x1 >= x2) return null;
          return (
            <ReferenceArea
              key={term.id}
              x1={x1}
              x2={x2}
              ifOverflow="hidden"
              fill="hsl(var(--foreground))"
              fillOpacity={i % 2 === 0 ? 0.04 : 0.09}
              label={{ value: term.label, position: 'insideTop', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
          );
        })}
        <XAxis
          dataKey="year"
          type="number"
          domain={[min, max]}
          allowDecimals={false}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
        />
        <YAxis
          domain={yDomain}
          width={44}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<TrendTip ind={ind} />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: ind.kind === 'survey' ? 5 : 2.5, fill: 'hsl(var(--primary))' }}
          activeDot={{ r: 6 }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function WindowBox({ title, w, ind }: { title: string; w: WindowRate | null; ind: TrendIndicator }) {
  return (
    <div className="rounded-md border border-border bg-background/50 p-3">
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      {w ? (
        <>
          <div className="font-mono text-lg text-foreground">
            {w.perYear > 0 ? '+' : w.perYear < 0 ? '−' : ''}
            {formatValue(Math.abs(w.perYear), ind.decimals + 1)}
            <span className="text-xs text-muted-foreground"> / year</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(w.from)}–{Math.round(w.to)} · <Direction improving={w.improving} />
          </div>
        </>
      ) : (
        <div className="text-xs text-muted-foreground">Not enough comparable years</div>
      )}
    </div>
  );
}

function RoundChanges({ ind }: { ind: TrendIndicator }) {
  const pts = [...ind.points].sort((a, b) => a.year - b.year);
  return (
    <ul className="space-y-1.5 text-xs">
      {pts.slice(1).map((p, i) => {
        const prev = pts[i];
        return (
          <li key={p.year} className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-muted-foreground">
              {prev.label ?? Math.round(prev.year)} → {p.label ?? Math.round(p.year)}
            </span>
            <span className="font-mono text-foreground">
              {formatValue(prev.value, ind.decimals)} → {formatValue(p.value, ind.decimals)}
            </span>
            <Direction improving={isImprovement(ind.direction, prev.value, p.value)} />
          </li>
        );
      })}
    </ul>
  );
}

function IndicatorCard({ ind }: { ind: TrendIndicator }) {
  const { before, since } = windowRates(ind);
  return (
    <article className="bg-card border border-card-border rounded-lg p-5" data-testid={`trend-${ind.id}`}>
      <header className="mb-2">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground leading-snug">{ind.title}</h2>
          <span className="shrink-0 rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">{ind.area}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {ind.unit} · {ind.direction === 'lower-better' ? 'lower is better' : 'higher is better'}
        </p>
      </header>

      <TrendChart ind={ind} />

      {ind.kind === 'annual' ? (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <WindowBox title={`Average change before ${SPLIT_YEAR}`} w={before} ind={ind} />
          <WindowBox title={`Average change since ${SPLIT_YEAR}`} w={since} ind={ind} />
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-border bg-background/50 p-3">
          <div className="text-xs text-muted-foreground mb-2">Change between survey rounds</div>
          <RoundChanges ind={ind} />
        </div>
      )}

      <p className="mt-3 flex gap-2 text-xs text-muted-foreground">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>{ind.caveat}</span>
      </p>
      <a
        href={ind.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline"
      >
        {ind.source} <ExternalLink className="w-3 h-3" />
      </a>
    </article>
  );
}

export default function Trends() {
  const { t } = useTranslation();
  const [area, setArea] = useState<'All' | TrendArea>('All');
  const shown = useMemo(
    () => TREND_INDICATORS.filter(i => area === 'All' || i.area === area),
    [area],
  );

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEO
        title={t('trendsSeoTitle', 'Trends since 2004')}
        description="Long-run indicators from official sources, shown across every government term since 2004 so direction of travel can be compared fairly."
        path="/trends"
      />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {t('trendsTitle', 'Trends since 2004')}
        </h1>
        <p className="text-muted-foreground max-w-3xl mb-6">
          {t(
            'trendsIntro',
            'An audit finding or a press release is a snapshot. These charts show the same indicators over time, across every government term, so you can see whether a measure was already improving, and how fast, before and after 2014.',
          )}
        </p>

        <div className="bg-card border border-card-border rounded-lg p-5 mb-8 text-sm text-muted-foreground">
          <h2 className="font-semibold text-foreground mb-2">How to read these charts</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Grey bands mark each government term. They are shaded alternately, with no party colours.</li>
            <li>
              Annual series are split at {SPLIT_YEAR}: the year (or financial year starting in) {SPLIT_YEAR} counts in the later
              period. Compare the <em>rate of change</em>, not just the level.
            </li>
            <li>
              Survey rounds are shown as they are. Fieldwork spans years and policies take time to work, so changes are
              not credited to a single government.
            </li>
            <li>Indicators that got worse are shown alongside those that improved.</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Filter by area">
          {AREAS.map(a => (
            <button
              key={a}
              role="tab"
              aria-selected={area === a}
              onClick={() => setArea(a)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                area === a
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {shown.map(ind => <IndicatorCard key={ind.id} ind={ind} />)}
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
          <h2 className="font-semibold text-foreground mb-1">What is not charted, and why</h2>
          <p>
            GDP growth and inflation are left out for now: their base years have been revised, so older and newer
            figures are not directly comparable. Pull current values straight from the MoSPI data API (see{' '}
            <a href="/sources" className="text-primary hover:underline">Sources</a>). Employment before 2017-18 is also left
            out because the earlier survey used a different design.
          </p>
        </div>
      </div>
    </div>
  );
}
