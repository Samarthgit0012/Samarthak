import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { Navbar } from '@/components/navbar';
import { SEO } from '@/components/seo';
import { cn } from '@/lib/utils';

const PRINCIPLES: Array<{ title: string; body: string }> = [
  {
    title: 'Same yardstick for everyone',
    body: 'The Union government and every state and UT are measured the same way, whichever party governs. The goal is that a supporter and a critic of any party would both accept the method, even if they dislike a result.',
  },
  {
    title: 'Always show the trend',
    body: 'Indicators run from about 2004 to the latest release, with a band for each government term. Level, speed of change before and after 2014, and setbacks are all shown.',
  },
  {
    title: 'Four layers of evidence',
    body: 'A scheme is read through its target, what the ministry reports delivering, what independent surveys measured, and what auditors found. An audit finding is one layer, never the whole verdict.',
  },
  {
    title: 'Audits are about how a scheme was run',
    body: 'CAG findings describe compliance, process and delivery gaps. Large schemes are audited more often and so collect more findings. The labels on this site say "audit signal" for that reason, not "on track" or "failed".',
  },
  {
    title: 'Allegations are not convictions',
    body: 'Declared criminal cases in election affidavits are self-declared and mostly pending. They are shown as declared, never as proof of guilt.',
  },
  {
    title: 'Measured data and opinion are kept apart',
    body: 'International perception and expert ratings sit in their own category, with their method noted. The Indian government has publicly disputed several of them.',
  },
  {
    title: 'Sources you can check',
    body: 'Every figure links to the document it came from, and the Sources page lists every public source used, across all parties.',
  },
  {
    title: 'Dated, and flagged when out of date',
    body: 'Each figure shows its period. When a newer release exists (for example the NFHS-6 fact sheets of June 2026), the older figure is marked for update.',
  },
  {
    title: 'Neutral wording',
    body: 'Verdict labels describe the evidence ("Serious audit findings", "Minor findings only", "No audit data"). They do not describe a government.',
  },
  {
    title: 'Corrections welcome',
    body: 'Anyone can report an error or a missing data point, and fixes are made against a cited source.',
  },
];

type Status = 'Live' | 'Partly' | 'Not yet';

const STATUS: Array<{ item: string; status: Status; note: string }> = [
  { item: 'Trends from 2004 with term bands', status: 'Live', note: '10 indicators from official sources, with annual rates before and since 2014.' },
  { item: 'Independent outcome layer (NFHS)', status: 'Live', note: '17 indicators linked to 13 schemes, including ones that got worse.' },
  { item: 'Neutral audit-signal wording', status: 'Live', note: 'Verdict labels and summaries no longer claim a scheme "is not meeting its objectives".' },
  { item: 'Source library across all parties', status: 'Live', note: 'Government, audit, surveys, elections, manifestos, fact-checkers.' },
  { item: 'Broader news mix', status: 'Live', note: 'More outlets across the spectrum in the news ticker.' },
  { item: 'Audit counts normalised by money audited', status: 'Not yet', note: 'Findings are still counted; the amount at stake is not yet used.' },
  { item: 'Review of stored severity labels', status: 'Partly', note: 'Labels on stored findings are not CAG\'s own grading and have not all been re-reviewed.' },
  { item: 'Target-versus-delivered tracking per scheme', status: 'Not yet', note: 'Needs figures from Outcome Budgets and ministry dashboards.' },
  { item: 'Manifestos of all parties', status: 'Partly', note: 'The tracker covers one party\'s manifestos; other parties\' are linked on Sources but not yet tracked.' },
  { item: 'All MPs and MLAs, not only Union ministers', status: 'Not yet', note: 'Planned from election-affidavit data.' },
  { item: 'Public corrections log', status: 'Not yet', note: 'Reports are collected; a public log is planned.' },
];

const STATUS_STYLE: Record<Status, string> = {
  Live: 'border-green-200 bg-green-100 text-green-900',
  Partly: 'border-amber-200 bg-amber-100 text-amber-900',
  'Not yet': 'border-gray-200 bg-gray-100 text-gray-700',
};

export default function Methodology() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-background">
      <SEO
        title={t('methodologySeoTitle', 'Methodology')}
        description="How the platform stays balanced: the rules it follows, what is live today and what is still missing."
        path="/methodology"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {t('methodologyTitle', 'Methodology')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t(
            'methodologyIntro',
            'This platform sets government claims beside audit findings and independent measurements. These are the rules it follows to stay fair, and an honest list of what is not done yet.',
          )}
        </p>

        <section className="bg-card border border-card-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Rules we follow</h2>
          <ol className="space-y-4 list-decimal pl-5">
            {PRINCIPLES.map(p => (
              <li key={p.title} className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{p.title}. </span>
                {p.body}
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-card border border-card-border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-1">What is done and what is missing</h2>
          <p className="text-sm text-muted-foreground mb-4">
            No site is finished. This is the current state, so you can judge the gaps yourself.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Item</th>
                  <th className="py-2 px-3 font-medium">Status</th>
                  <th className="py-2 pl-3 font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {STATUS.map(row => (
                  <tr key={row.item} className="border-b border-border/60 align-top">
                    <td className="py-2 pr-3 text-foreground">{row.item}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className={cn('inline-flex rounded border px-2 py-0.5 text-xs font-medium', STATUS_STYLE[row.status])}>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-muted-foreground">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-card border border-card-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-3">Known limits</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>Survey and audit data arrive with a lag. The most recent months are never covered.</li>
            <li>Scheme-level outcomes come from national surveys, which cannot show what one scheme caused.</li>
            <li>Scores are summaries. Open the underlying figures before relying on a score.</li>
            <li>Found a mistake or a missing source? <Link href="/report-issue" className="text-primary hover:underline">Report an issue</Link>. See the full list on the <Link href="/sources" className="text-primary hover:underline">Sources page</Link>.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
