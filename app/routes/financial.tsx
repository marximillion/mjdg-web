// Copyright © MJMDG 2026
import { redirect } from "react-router";
import { useEffect, useRef } from "react";
import type { Route } from "./+types/financial";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";
import {
  Chart,
  DoughnutController,
  BarController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Financial | LAB<3" },
    { name: "description", content: "Platform cost overview and financial dashboard." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

// ── Data ────────────────────────────────────────────────────────────────────

const MONTHLY = [
  { label: "EC2 t3.micro", amount: 10.51, color: "#4A9EE8" },
  { label: "Elastic IP",   amount: 3.60,  color: "#FFD100" },
  { label: "Domain",       amount: 1.00,  color: "#A78BFA" },
  { label: "EBS 8GB gp3",  amount: 0.64,  color: "#F97316" },
];

const SETUP = [
  { label: "E&O Insurance (first yr)", amount: 1000 },
  { label: "CPA Consultation",         amount: 400  },
  { label: "Trade Name Registration",  amount: 60   },
  { label: "Business Bank Account",    amount: 50   },
  { label: "GST/HST Registration",     amount: 0    },
  { label: "Business Number (CRA)",    amount: 0    },
];

const TAX_LEVELS = [20, 30, 40, 50, 75];
const SOLE_TAX   = TAX_LEVELS.map(k => Math.round(k * 1000 * 0.48));
const CORP_TAX   = TAX_LEVELS.map(k => Math.round(k * 1000 * 0.11));
const NET_SAVE   = TAX_LEVELS.map((_, i) => Math.max(0, SOLE_TAX[i] - CORP_TAX[i] - 2500));

const MONTHLY_TOTAL = MONTHLY.reduce((s, i) => s + i.amount, 0);

// ── Component ────────────────────────────────────────────────────────────────

export default function Financial({ loaderData }: Route.ComponentProps) {
  const donutRef  = useRef<HTMLCanvasElement>(null);
  const setupRef  = useRef<HTMLCanvasElement>(null);
  const taxRef    = useRef<HTMLCanvasElement>(null);
  const chartsRef = useRef<Chart[]>([]);

  useEffect(() => {
    // Destroy any chart Chart.js has registered on each canvas (handles StrictMode double-invoke)
    [donutRef, setupRef, taxRef].forEach(ref => {
      if (ref.current) Chart.getChart(ref.current)?.destroy();
    });
    chartsRef.current = [];

    const s = getComputedStyle(document.documentElement);
    const v = (name: string) => s.getPropertyValue(name).trim();
    const bgPanel    = v("--bg-panel");
    const bgElevated = v("--bg-elevated");
    const border     = v("--border");
    const textPrimary = v("--text-primary");
    const textMuted  = v("--text-muted");
    const textSubtle = v("--text-subtle");
    const brandRed   = v("--brand-red");
    const brandBlue  = v("--brand-blue");

    const tooltipBase = {
      backgroundColor: bgElevated,
      titleColor: textPrimary,
      bodyColor: textMuted,
      borderColor: border,
      borderWidth: 1,
      padding: 10,
      titleFont: { family: "'JetBrains Mono', monospace" as const, size: 11 },
      bodyFont:  { family: "'JetBrains Mono', monospace" as const, size: 11 },
    };

    // Donut
    if (donutRef.current) {
      chartsRef.current.push(new Chart(donutRef.current, {
        type: "doughnut",
        data: {
          labels: MONTHLY.map(i => i.label),
          datasets: [{
            data: MONTHLY.map(i => i.amount),
            backgroundColor: MONTHLY.map(i => i.color),
            borderWidth: 2,
            borderColor: bgPanel,
            hoverOffset: 5,
          }],
        },
        options: {
          responsive: false,
          cutout: "68%",
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipBase,
              callbacks: { label: ctx => ` $${(ctx.parsed as number).toFixed(2)}/mo` },
            },
          },
        },
      }));
    }

    // Setup costs — horizontal bar
    if (setupRef.current) {
      chartsRef.current.push(new Chart(setupRef.current, {
        type: "bar",
        data: {
          labels: SETUP.map(i => i.label),
          datasets: [{
            data: SETUP.map(i => i.amount),
            backgroundColor: "#4A9EE8BB",
            borderColor: "#4A9EE8",
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: "start",
          }],
        },
        options: {
          indexAxis: "y",
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipBase,
              callbacks: {
                label: ctx => (ctx.parsed as { x: number }).x === 0
                  ? " Free"
                  : ` $${(ctx.parsed as { x: number }).x.toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              ticks: {
                color: textSubtle,
                font: { family: "'JetBrains Mono', monospace", size: 10 },
                callback: (v) => v === 0 ? "$0" : `$${Number(v).toLocaleString()}`,
              },
              grid: { color: border },
              border: { color: border },
            },
            y: {
              ticks: { color: textMuted, font: { size: 11 } },
              grid: { display: false },
              border: { color: border },
            },
          },
        },
      }));
    }

    // Tax comparison — grouped bar
    if (taxRef.current) {
      chartsRef.current.push(new Chart(taxRef.current, {
        type: "bar",
        data: {
          labels: TAX_LEVELS.map(k => `$${k}K`),
          datasets: [
            {
              label: "Sole Prop tax",
              data: SOLE_TAX,
              backgroundColor: brandRed + "CC",
              borderColor: brandRed,
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: "bottom",
            },
            {
              label: "Corporate tax",
              data: CORP_TAX,
              backgroundColor: brandBlue + "CC",
              borderColor: brandBlue,
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: "bottom",
            },
            {
              label: "Net savings",
              data: NET_SAVE,
              backgroundColor: "#34C97EAA",
              borderColor: "#34C97E",
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: "bottom",
            },
          ],
        },
        options: {
          responsive: true,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipBase,
              callbacks: {
                label: ctx => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: textMuted, font: { family: "'JetBrains Mono', monospace", size: 12 } },
              grid: { display: false },
              border: { color: border },
              title: { display: true, text: "MJMDG net profit", color: textSubtle, font: { size: 10, family: "'JetBrains Mono', monospace" } },
            },
            y: {
              ticks: {
                color: textSubtle,
                font: { family: "'JetBrains Mono', monospace", size: 10 },
                callback: (v) => `$${(Number(v) / 1000).toFixed(0)}K`,
              },
              grid: { color: border },
              border: { color: border },
              title: { display: true, text: "Amount (CAD)", color: textSubtle, font: { size: 10, family: "'JetBrains Mono', monospace" } },
            },
          },
        },
      }));
    }

    return () => {
      [donutRef, setupRef, taxRef].forEach(ref => {
        if (ref.current) Chart.getChart(ref.current)?.destroy();
      });
      chartsRef.current = [];
    };
  }, []);

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content">
        <div className="fin-page">

          {/* Header */}
          <div className="fin-header">
            <div>
              <div className="fin-title">Financial</div>
              <div className="fin-subtitle">Platform cost overview · mock</div>
            </div>
            <div className="fin-meta">
              Last updated: Sep 2026<br />
              Region: ca-west-1 · Alberta, CA
            </div>
          </div>

          {/* KPI tiles */}
          <div className="fin-kpi-row">
            <div className="fin-kpi blue">
              <div className="fin-kpi-label">Monthly Burn</div>
              <div className="fin-kpi-value">${MONTHLY_TOTAL.toFixed(2)}</div>
              <div className="fin-kpi-sub">on-demand · no free tier</div>
            </div>
            <div className="fin-kpi gold">
              <div className="fin-kpi-label">Annual Burn</div>
              <div className="fin-kpi-value">${(MONTHLY_TOTAL * 12).toFixed(0)}</div>
              <div className="fin-kpi-sub">projected at current usage</div>
            </div>
            <div className="fin-kpi">
              <div className="fin-kpi-label">Sole Prop Setup</div>
              <div className="fin-kpi-value">~$1,460</div>
              <div className="fin-kpi-sub">one-time · no incorporation</div>
            </div>
          </div>

          {/* Donut + Setup costs */}
          <div className="fin-row">
            <div className="fin-card">
              <div className="fin-card-title">Monthly Recurring — Breakdown</div>
              <div className="fin-donut-wrap">
                <canvas ref={donutRef} width={140} height={140} style={{ flexShrink: 0 }} />
                <div className="fin-donut-legend">
                  {MONTHLY.map(item => (
                    <div className="fin-legend-item" key={item.label}>
                      <div className="fin-legend-left">
                        <div className="fin-legend-dot" style={{ background: item.color }} />
                        <span>{item.label}</span>
                      </div>
                      <span className="fin-legend-amt">${item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="fin-card">
              <div className="fin-card-title">One-Time Setup Costs (Sole Prop)</div>
              <canvas ref={setupRef} style={{ maxHeight: 220 }} />
            </div>
          </div>

          {/* Tax comparison */}
          <div className="fin-card-full">
            <div className="fin-card-title">Tax Comparison — Sole Prop vs Incorporated</div>
            <div className="fin-tax-legend">
              <div className="fin-tax-legend-item">
                <div className="fin-tax-swatch" style={{ background: "var(--brand-red)", opacity: 0.85 }} />
                Sole Prop (~48% Alberta top marginal)
              </div>
              <div className="fin-tax-legend-item">
                <div className="fin-tax-swatch" style={{ background: "var(--brand-blue)" }} />
                Corporate (~11% small biz rate)
              </div>
              <div className="fin-tax-legend-item">
                <div className="fin-tax-swatch" style={{ background: "#34C97E", opacity: 0.8 }} />
                Net savings after $2,500 accountant
              </div>
            </div>
            <canvas ref={taxRef} style={{ maxHeight: 280 }} />
            <div className="fin-annotation">
              <span className="fin-annotation-tag">INCORPORATE HERE</span>
              At $30–40K MJMDG net profit, savings outweigh corporate admin costs (~$2,500/yr).
              Given existing Homewood salary, all MJMDG income stacks at your highest marginal rate —
              threshold is lower than average.
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
