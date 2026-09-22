// Copyright © MJMDG 2026
import { redirect } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/financial";
import PageLayout from "~/components/PageLayout";
import { getUserFromSession } from "~/db/session.server";
import {
  Chart,
  DoughnutController,
  BarController,
  LineController,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Filler,
} from "chart.js";

Chart.register(
  DoughnutController, BarController, LineController,
  ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Filler
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Financial | LAB<3" },
    { name: "description", content: "Platform cost overview and personal finance dashboard." },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserFromSession(request);
  if (!userId) return redirect("/");
  return { isAuthenticated: true };
}

// ── V1 — Platform cost data ──────────────────────────────────────────────────

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

// ── V2 — Personal finance data model + mock ──────────────────────────────────
// TODO: replace with loader data from spreadsheet import / DB

interface PayPeriod {
  startDate: string;
  endDate: string;
  grossIncome: number;
  netIncome: number;
}
interface Expense {
  category: string;
  amount: number;
}
interface SavingsBucket {
  name: string;
  allocated: number;  // per pay period
  balance: number;    // current balance
  target: number;
}
interface Debt {
  name: string;
  balance: number;
  originalBalance: number;
  monthlyPayment: number;
  interestRate: number;
  payoffDate: string;
}
interface Account {
  institution: string;
  type: string;
  balance: number;    // negative = liability
}
interface NetWorthPoint {
  month: string;
  value: number;
}
interface KeyDate {
  label: string;
  date: string;
  amount: number;
  category: string;
}

const PAY_PERIOD: PayPeriod = {
  startDate: "Sep 1, 2026",
  endDate: "Sep 14, 2026",
  grossIncome: 3200,
  netIncome: 2450,
};

const FIXED: Expense[] = [
  { category: "Rent",             amount: 850 },
  { category: "Auto Insurance",   amount: 180 },
  { category: "Phone",            amount: 65  },
  { category: "Transit Pass",     amount: 120 },
  { category: "Subscriptions",    amount: 55  },
  { category: "Gym",              amount: 40  },
];

const VARIABLE: Expense[] = [
  { category: "Groceries",        amount: 320 },
  { category: "Gas",              amount: 180 },
  { category: "Eating Out",       amount: 210 },
  { category: "Pet Costs",        amount: 90  },
  { category: "Personal Wants",   amount: 150 },
];

const SAVINGS: SavingsBucket[] = [
  { name: "Emergency Fund",  allocated: 200, balance: 4800,  target: 10000 },
  { name: "Debt Payment",    allocated: 400, balance: 0,     target: 0     },
  { name: "Travel",          allocated: 100, balance: 1200,  target: 3000  },
  { name: "Shared Goals",    allocated: 100, balance: 800,   target: 5000  },
];

const DEBTS: Debt[] = [
  { name: "Student Loan",   balance: 8400,  originalBalance: 22000, monthlyPayment: 350, interestRate: 4.5, payoffDate: "Mar 2029" },
  { name: "Car Loan (CSX)", balance: 2100,  originalBalance: 9000,  monthlyPayment: 350, interestRate: 6.9, payoffDate: "Jun 2027" },
];

const ACCOUNTS: Account[] = [
  { institution: "TD Bank",   type: "Chequing", balance: 2800  },
  { institution: "TD Bank",   type: "Savings",  balance: 4800  },
  { institution: "Questrade", type: "TFSA",     balance: 12400 },
  { institution: "Questrade", type: "RRSP",     balance: 3200  },
  { institution: "TD Visa",   type: "Credit",   balance: -840  },
];

const NET_WORTH_HISTORY: NetWorthPoint[] = [
  { month: "Apr", value: 18200 },
  { month: "May", value: 19100 },
  { month: "Jun", value: 20400 },
  { month: "Jul", value: 20900 },
  { month: "Aug", value: 21800 },
  { month: "Sep", value: 22360 },
];

const KEY_DATES: KeyDate[] = [
  { label: "Rent",                date: "Oct 1",  amount: 850, category: "Fixed"        },
  { label: "Auto Insurance",      date: "Oct 15", amount: 180, category: "Fixed"        },
  { label: "Questrade Annual Fee",date: "Oct 22", amount: 0,   category: "Investment"   },
  { label: "Phone Bill",          date: "Oct 28", amount: 65,  category: "Fixed"        },
  { label: "Netflix",             date: "Nov 3",  amount: 17,  category: "Subscription" },
  { label: "Gym Membership",      date: "Nov 5",  amount: 40,  category: "Fixed"        },
];

// ── Derived ──────────────────────────────────────────────────────────────────

const totalFixed    = FIXED.reduce((s, e) => s + e.amount, 0);
const totalVariable = VARIABLE.reduce((s, e) => s + e.amount, 0);
const totalSavings  = SAVINGS.reduce((s, b) => s + b.allocated, 0);
const totalExpenses = totalFixed + totalVariable + totalSavings;
const savingsRate   = Math.round((totalSavings / PAY_PERIOD.netIncome) * 100);
const netWorth      = ACCOUNTS.reduce((s, a) => s + a.balance, 0);

type V2View = "overview" | "budget" | "networth" | "debt" | "calendar";

// ── Component ────────────────────────────────────────────────────────────────

export default function Financial({ loaderData }: Route.ComponentProps) {
  const [activeTab, setActiveTab] = useState<"v1" | "v2">("v1");
  const [v2View, setV2View]       = useState<V2View>("overview");

  // V1 chart refs
  const donutRef  = useRef<HTMLCanvasElement>(null);
  const setupRef  = useRef<HTMLCanvasElement>(null);
  const taxRef    = useRef<HTMLCanvasElement>(null);

  // V2 chart refs
  const v2BudgetRef    = useRef<HTMLCanvasElement>(null);
  const v2CategoryRef  = useRef<HTMLCanvasElement>(null);
  const v2NetWorthRef  = useRef<HTMLCanvasElement>(null);

  // ── V1 charts ──
  useEffect(() => {
    if (activeTab !== "v1") return;
    [donutRef, setupRef, taxRef].forEach(r => { if (r.current) Chart.getChart(r.current)?.destroy(); });

    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    const bgPanel = v("--bg-panel"), bgElevated = v("--bg-elevated"), border = v("--border");
    const textPrimary = v("--text-primary"), textMuted = v("--text-muted"), textSubtle = v("--text-subtle");
    const brandRed = v("--brand-red"), brandBlue = v("--brand-blue");

    const tt = {
      backgroundColor: bgElevated, titleColor: textPrimary, bodyColor: textMuted,
      borderColor: border, borderWidth: 1, padding: 10,
      titleFont: { family: "'JetBrains Mono', monospace" as const, size: 11 },
      bodyFont:  { family: "'JetBrains Mono', monospace" as const, size: 11 },
    };

    if (donutRef.current) new Chart(donutRef.current, {
      type: "doughnut",
      data: { labels: MONTHLY.map(i => i.label), datasets: [{ data: MONTHLY.map(i => i.amount), backgroundColor: MONTHLY.map(i => i.color), borderWidth: 2, borderColor: bgPanel, hoverOffset: 5 }] },
      options: { responsive: false, cutout: "68%", plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => ` $${(ctx.parsed as number).toFixed(2)}/mo` } } } },
    });

    if (setupRef.current) new Chart(setupRef.current, {
      type: "bar",
      data: { labels: SETUP.map(i => i.label), datasets: [{ data: SETUP.map(i => i.amount), backgroundColor: "#4A9EE8BB", borderColor: "#4A9EE8", borderWidth: 1, borderRadius: 4, borderSkipped: "start" as const }] },
      options: { indexAxis: "y" as const, responsive: true, plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => (ctx.parsed as { x: number }).x === 0 ? " Free" : ` $${(ctx.parsed as { x: number }).x.toLocaleString()}` } } }, scales: { x: { ticks: { color: textSubtle, font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (val) => val === 0 ? "$0" : `$${Number(val).toLocaleString()}` }, grid: { color: border }, border: { color: border } }, y: { ticks: { color: textMuted, font: { size: 11 } }, grid: { display: false }, border: { color: border } } } },
    });

    if (taxRef.current) new Chart(taxRef.current, {
      type: "bar",
      data: { labels: TAX_LEVELS.map(k => `$${k}K`), datasets: [
        { label: "Sole Prop tax", data: SOLE_TAX, backgroundColor: brandRed + "CC", borderColor: brandRed, borderWidth: 1, borderRadius: 4, borderSkipped: "bottom" as const },
        { label: "Corporate tax", data: CORP_TAX, backgroundColor: brandBlue + "CC", borderColor: brandBlue, borderWidth: 1, borderRadius: 4, borderSkipped: "bottom" as const },
        { label: "Net savings",   data: NET_SAVE, backgroundColor: "#34C97EAA", borderColor: "#34C97E", borderWidth: 1, borderRadius: 4, borderSkipped: "bottom" as const },
      ]},
      options: { responsive: true, interaction: { mode: "index", intersect: false }, plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => ` ${ctx.dataset.label}: $${(ctx.parsed.y ?? 0).toLocaleString()}` } } }, scales: { x: { ticks: { color: textMuted, font: { family: "'JetBrains Mono', monospace", size: 12 } }, grid: { display: false }, border: { color: border }, title: { display: true, text: "MJMDG net profit", color: textSubtle, font: { size: 10, family: "'JetBrains Mono', monospace" } } }, y: { ticks: { color: textSubtle, font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (val) => `$${(Number(val) / 1000).toFixed(0)}K` }, grid: { color: border }, border: { color: border }, title: { display: true, text: "Amount (CAD)", color: textSubtle, font: { size: 10, family: "'JetBrains Mono', monospace" } } } } },
    });

    return () => { [donutRef, setupRef, taxRef].forEach(r => { if (r.current) Chart.getChart(r.current)?.destroy(); }); };
  }, [activeTab]);

  // ── V2 charts ──
  useEffect(() => {
    if (activeTab !== "v2") return;
    [v2BudgetRef, v2CategoryRef, v2NetWorthRef].forEach(r => { if (r.current) Chart.getChart(r.current)?.destroy(); });

    const s = getComputedStyle(document.documentElement);
    const v = (n: string) => s.getPropertyValue(n).trim();
    const bgPanel = v("--bg-panel"), bgElevated = v("--bg-elevated"), border = v("--border");
    const textPrimary = v("--text-primary"), textMuted = v("--text-muted"), textSubtle = v("--text-subtle");
    const brandRed = v("--brand-red"), brandBlue = v("--brand-blue"), brandGold = v("--brand-gold");

    const tt = {
      backgroundColor: bgElevated, titleColor: textPrimary, bodyColor: textMuted,
      borderColor: border, borderWidth: 1, padding: 10,
      titleFont: { family: "'JetBrains Mono', monospace" as const, size: 11 },
      bodyFont:  { family: "'JetBrains Mono', monospace" as const, size: 11 },
    };

    // Budget split donut
    if (v2BudgetRef.current) new Chart(v2BudgetRef.current, {
      type: "doughnut",
      data: {
        labels: ["Fixed", "Variable", "Savings"],
        datasets: [{ data: [totalFixed, totalVariable, totalSavings], backgroundColor: [brandBlue + "CC", brandRed + "CC", "#34C97ECC"], borderWidth: 2, borderColor: bgPanel, hoverOffset: 5 }],
      },
      options: { responsive: false, cutout: "65%", plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => ` $${(ctx.parsed as number).toLocaleString()}/period` } } } },
    });

    // Category bar (all expenses combined)
    const allExpenses = [...FIXED, ...VARIABLE].sort((a, b) => b.amount - a.amount);
    if (v2CategoryRef.current) new Chart(v2CategoryRef.current, {
      type: "bar",
      data: {
        labels: allExpenses.map(e => e.category),
        datasets: [{ data: allExpenses.map(e => e.amount), backgroundColor: allExpenses.map((_, i) => i < FIXED.length ? brandBlue + "99" : brandRed + "99"), borderColor: allExpenses.map((_, i) => i < FIXED.length ? brandBlue : brandRed), borderWidth: 1, borderRadius: 4, borderSkipped: "start" as const }],
      },
      options: { indexAxis: "y" as const, responsive: true, plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => ` $${(ctx.parsed as { x: number }).x.toLocaleString()}/period` } } }, scales: { x: { ticks: { color: textSubtle, font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (val) => `$${Number(val).toLocaleString()}` }, grid: { color: border }, border: { color: border } }, y: { ticks: { color: textMuted, font: { size: 11 } }, grid: { display: false }, border: { color: border } } } },
    });

    // Net worth line
    if (v2NetWorthRef.current) new Chart(v2NetWorthRef.current, {
      type: "line",
      data: {
        labels: NET_WORTH_HISTORY.map(p => p.month),
        datasets: [{
          label: "Net Worth",
          data: NET_WORTH_HISTORY.map(p => p.value),
          borderColor: brandGold,
          backgroundColor: brandGold + "18",
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: brandGold,
          tension: 0.35,
          fill: true,
        }],
      },
      options: { responsive: true, plugins: { legend: { display: false }, tooltip: { ...tt, callbacks: { label: ctx => ` $${(ctx.parsed.y ?? 0).toLocaleString()}` } } }, scales: { x: { ticks: { color: textMuted, font: { family: "'JetBrains Mono', monospace", size: 11 } }, grid: { display: false }, border: { color: border } }, y: { ticks: { color: textSubtle, font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (val) => `$${(Number(val) / 1000).toFixed(0)}K` }, grid: { color: border }, border: { color: border } } } },
    });

    return () => { [v2BudgetRef, v2CategoryRef, v2NetWorthRef].forEach(r => { if (r.current) Chart.getChart(r.current)?.destroy(); }); };
  }, [activeTab, v2View]);

  return (
    <PageLayout isAuthenticated={loaderData.isAuthenticated}>
      <div className="page-content">
        <div className="fin-page">

          {/* ── Top-level tab bar ── */}
          <div className="fin-tab-bar">
            <button className={`fin-tab${activeTab === "v1" ? " active" : ""}`} onClick={() => setActiveTab("v1")}>
              Platform Costs
            </button>
            <button className={`fin-tab${activeTab === "v2" ? " active" : ""}`} onClick={() => setActiveTab("v2")}>
              Personal Finance
              <span className="fin-tab-badge">stub</span>
            </button>
          </div>

          {/* ════════════════════════ V1 ════════════════════════ */}
          {activeTab === "v1" && (
            <>
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

              <div className="fin-card-full">
                <div className="fin-card-title">Tax Comparison — Sole Prop vs Incorporated</div>
                <div className="fin-tax-legend">
                  <div className="fin-tax-legend-item"><div className="fin-tax-swatch" style={{ background: "var(--brand-red)", opacity: 0.85 }} />Sole Prop (~48% Alberta top marginal)</div>
                  <div className="fin-tax-legend-item"><div className="fin-tax-swatch" style={{ background: "var(--brand-blue)" }} />Corporate (~11% small biz rate)</div>
                  <div className="fin-tax-legend-item"><div className="fin-tax-swatch" style={{ background: "#34C97E", opacity: 0.8 }} />Net savings after $2,500 accountant</div>
                </div>
                <canvas ref={taxRef} style={{ maxHeight: 280 }} />
                <div className="fin-annotation">
                  <span className="fin-annotation-tag">INCORPORATE HERE</span>
                  At $30–40K MJMDG net profit, savings outweigh corporate admin costs (~$2,500/yr).
                  Given existing Homewood salary, all MJMDG income stacks at your highest marginal rate —
                  threshold is lower than average.
                </div>
              </div>
            </>
          )}

          {/* ════════════════════════ V2 ════════════════════════ */}
          {activeTab === "v2" && (
            <>
              <div className="fin-header">
                <div>
                  <div className="fin-title">Personal Finance</div>
                  <div className="fin-subtitle">Pay period: {PAY_PERIOD.startDate} — {PAY_PERIOD.endDate} · mock data</div>
                </div>
                <div className="fin-meta">
                  Bi-weekly tracking<br />
                  Spreadsheet import: pending
                </div>
              </div>

              {/* V2 sub-nav */}
              <div className="fin-subnav">
                {(["overview", "budget", "networth", "debt", "calendar"] as V2View[]).map(view => (
                  <button
                    key={view}
                    className={`fin-subnav-item${v2View === view ? " active" : ""}`}
                    onClick={() => setV2View(view)}
                  >
                    {view === "overview"  && "Overview"}
                    {view === "budget"    && "Budget"}
                    {view === "networth"  && "Net Worth"}
                    {view === "debt"      && "Debt"}
                    {view === "calendar"  && "Calendar"}
                  </button>
                ))}
              </div>

              {/* ── Overview ── */}
              {v2View === "overview" && (
                <>
                  <div className="fin-kpi-row">
                    <div className="fin-kpi blue">
                      <div className="fin-kpi-label">Net Income</div>
                      <div className="fin-kpi-value">${PAY_PERIOD.netIncome.toLocaleString()}</div>
                      <div className="fin-kpi-sub">after tax · bi-weekly</div>
                    </div>
                    <div className="fin-kpi red">
                      <div className="fin-kpi-label">Total Expenses</div>
                      <div className="fin-kpi-value">${totalExpenses.toLocaleString()}</div>
                      <div className="fin-kpi-sub">fixed + variable + savings</div>
                    </div>
                    <div className="fin-kpi green">
                      <div className="fin-kpi-label">Savings Rate</div>
                      <div className="fin-kpi-value">{savingsRate}%</div>
                      <div className="fin-kpi-sub">${totalSavings}/period allocated</div>
                    </div>
                    <div className="fin-kpi gold">
                      <div className="fin-kpi-label">Net Worth</div>
                      <div className="fin-kpi-value">${netWorth.toLocaleString()}</div>
                      <div className="fin-kpi-sub">all accounts combined</div>
                    </div>
                  </div>

                  <div className="fin-row">
                    <div className="fin-card">
                      <div className="fin-card-title">Income vs. Expenses</div>
                      <div className="fin-income-bar-wrap">
                        <div className="fin-income-bar-row">
                          <span className="fin-bar-label">Net Income</span>
                          <div className="fin-bar-track">
                            <div className="fin-bar-fill fin-bar-income" style={{ width: "100%" }} />
                          </div>
                          <span className="fin-bar-amt">${PAY_PERIOD.netIncome.toLocaleString()}</span>
                        </div>
                        <div className="fin-income-bar-row">
                          <span className="fin-bar-label">Fixed</span>
                          <div className="fin-bar-track">
                            <div className="fin-bar-fill fin-bar-fixed" style={{ width: `${(totalFixed / PAY_PERIOD.netIncome) * 100}%` }} />
                          </div>
                          <span className="fin-bar-amt">${totalFixed.toLocaleString()}</span>
                        </div>
                        <div className="fin-income-bar-row">
                          <span className="fin-bar-label">Variable</span>
                          <div className="fin-bar-track">
                            <div className="fin-bar-fill fin-bar-variable" style={{ width: `${(totalVariable / PAY_PERIOD.netIncome) * 100}%` }} />
                          </div>
                          <span className="fin-bar-amt">${totalVariable.toLocaleString()}</span>
                        </div>
                        <div className="fin-income-bar-row">
                          <span className="fin-bar-label">Savings</span>
                          <div className="fin-bar-track">
                            <div className="fin-bar-fill fin-bar-savings" style={{ width: `${(totalSavings / PAY_PERIOD.netIncome) * 100}%` }} />
                          </div>
                          <span className="fin-bar-amt">${totalSavings.toLocaleString()}</span>
                        </div>
                        <div className="fin-income-bar-row">
                          <span className="fin-bar-label">Remaining</span>
                          <div className="fin-bar-track">
                            <div className="fin-bar-fill fin-bar-remaining" style={{ width: `${Math.max(0, ((PAY_PERIOD.netIncome - totalExpenses) / PAY_PERIOD.netIncome)) * 100}%` }} />
                          </div>
                          <span className="fin-bar-amt">${Math.max(0, PAY_PERIOD.netIncome - totalExpenses).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="fin-card">
                      <div className="fin-card-title">Upcoming Key Dates</div>
                      <div className="fin-dates-list">
                        {KEY_DATES.slice(0, 4).map(d => (
                          <div className="fin-date-row" key={d.label}>
                            <div className="fin-date-pill">{d.date}</div>
                            <div className="fin-date-label">{d.label}</div>
                            <div className="fin-date-amt">{d.amount === 0 ? "Free" : `$${d.amount}`}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Budget ── */}
              {v2View === "budget" && (
                <>
                  <div className="fin-row">
                    <div className="fin-card">
                      <div className="fin-card-title">Budget Split</div>
                      <div className="fin-donut-wrap">
                        <canvas ref={v2BudgetRef} width={140} height={140} style={{ flexShrink: 0 }} />
                        <div className="fin-donut-legend">
                          {[
                            { label: "Fixed",    amount: totalFixed,    color: "var(--brand-blue)" },
                            { label: "Variable", amount: totalVariable, color: "var(--brand-red)"  },
                            { label: "Savings",  amount: totalSavings,  color: "#34C97E"            },
                          ].map(item => (
                            <div className="fin-legend-item" key={item.label}>
                              <div className="fin-legend-left">
                                <div className="fin-legend-dot" style={{ background: item.color }} />
                                <span>{item.label}</span>
                              </div>
                              <span className="fin-legend-amt">${item.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="fin-card">
                      <div className="fin-card-title">Savings Buckets</div>
                      <div className="fin-savings-list">
                        {SAVINGS.map(b => (
                          <div key={b.name} className="fin-savings-row">
                            <div className="fin-savings-name">{b.name}</div>
                            <div className="fin-savings-meta">
                              {b.target > 0 && (
                                <>
                                  <div className="fin-progress-track">
                                    <div className="fin-progress-fill" style={{ width: `${Math.min(100, (b.balance / b.target) * 100)}%` }} />
                                  </div>
                                  <span className="fin-savings-pct">{Math.round((b.balance / b.target) * 100)}%</span>
                                </>
                              )}
                            </div>
                            <span className="fin-legend-amt">+${b.allocated}/period</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="fin-card-full">
                    <div className="fin-card-title">Expenses by Category</div>
                    <canvas ref={v2CategoryRef} style={{ maxHeight: 300 }} />
                    <div className="fin-tax-legend" style={{ marginTop: "1rem" }}>
                      <div className="fin-tax-legend-item"><div className="fin-tax-swatch" style={{ background: "var(--brand-blue)" }} />Fixed</div>
                      <div className="fin-tax-legend-item"><div className="fin-tax-swatch" style={{ background: "var(--brand-red)" }} />Variable</div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Net Worth ── */}
              {v2View === "networth" && (
                <>
                  <div className="fin-kpi-row">
                    <div className="fin-kpi gold">
                      <div className="fin-kpi-label">Total Net Worth</div>
                      <div className="fin-kpi-value">${netWorth.toLocaleString()}</div>
                      <div className="fin-kpi-sub">assets minus liabilities</div>
                    </div>
                    <div className="fin-kpi green">
                      <div className="fin-kpi-label">MoM Growth</div>
                      <div className="fin-kpi-value">+${(NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 1].value - NET_WORTH_HISTORY[NET_WORTH_HISTORY.length - 2].value).toLocaleString()}</div>
                      <div className="fin-kpi-sub">vs. last month</div>
                    </div>
                  </div>

                  <div className="fin-card-full">
                    <div className="fin-card-title">Net Worth — 6 Month Trend</div>
                    <canvas ref={v2NetWorthRef} style={{ maxHeight: 280 }} />
                  </div>

                  <div className="fin-card-full">
                    <div className="fin-card-title">Accounts</div>
                    <div className="fin-accounts-table">
                      <div className="fin-accounts-head">
                        <span>Institution</span>
                        <span>Type</span>
                        <span className="fin-col-right">Balance</span>
                      </div>
                      {ACCOUNTS.map(a => (
                        <div className="fin-accounts-row" key={a.institution + a.type}>
                          <span>{a.institution}</span>
                          <span className="fin-acct-type">{a.type}</span>
                          <span className={`fin-col-right ${a.balance < 0 ? "fin-val-neg" : "fin-val-pos"}`}>
                            {a.balance < 0 ? `-$${Math.abs(a.balance).toLocaleString()}` : `$${a.balance.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                      <div className="fin-accounts-total">
                        <span>Total</span>
                        <span />
                        <span className="fin-col-right">${netWorth.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── Debt ── */}
              {v2View === "debt" && (
                <>
                  <div className="fin-kpi-row">
                    <div className="fin-kpi red">
                      <div className="fin-kpi-label">Total Debt</div>
                      <div className="fin-kpi-value">${DEBTS.reduce((s, d) => s + d.balance, 0).toLocaleString()}</div>
                      <div className="fin-kpi-sub">{DEBTS.length} active loans</div>
                    </div>
                    <div className="fin-kpi">
                      <div className="fin-kpi-label">Monthly Payments</div>
                      <div className="fin-kpi-value">${DEBTS.reduce((s, d) => s + d.monthlyPayment, 0).toLocaleString()}</div>
                      <div className="fin-kpi-sub">combined minimum</div>
                    </div>
                  </div>

                  <div className="fin-debts-list">
                    {DEBTS.map(d => {
                      const pct = Math.round(((d.originalBalance - d.balance) / d.originalBalance) * 100);
                      return (
                        <div className="fin-debt-card" key={d.name}>
                          <div className="fin-debt-header">
                            <div>
                              <div className="fin-debt-name">{d.name}</div>
                              <div className="fin-kpi-sub">{d.interestRate}% interest · payoff {d.payoffDate}</div>
                            </div>
                            <div className="fin-debt-balance">
                              <span className="fin-val-neg">${d.balance.toLocaleString()}</span>
                              <span className="fin-debt-orig"> / ${d.originalBalance.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="fin-debt-progress-wrap">
                            <div className="fin-progress-track fin-progress-track--wide">
                              <div className="fin-progress-fill fin-progress-fill--green" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="fin-debt-pct">{pct}% paid off</span>
                          </div>
                          <div className="fin-kpi-sub" style={{ marginTop: "0.35rem" }}>
                            ${d.monthlyPayment}/mo payment
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ── Calendar ── */}
              {v2View === "calendar" && (
                <div className="fin-card-full">
                  <div className="fin-card-title">Upcoming Bills & Key Dates</div>
                  <div className="fin-calendar-list">
                    {KEY_DATES.map(d => (
                      <div className="fin-cal-row" key={d.label + d.date}>
                        <div className="fin-cal-date">{d.date}</div>
                        <div className="fin-cal-info">
                          <div className="fin-cal-label">{d.label}</div>
                          <div className="fin-cal-cat">{d.category}</div>
                        </div>
                        <div className="fin-cal-amt">
                          {d.amount === 0 ? <span className="fin-cal-free">Free</span> : `$${d.amount.toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </PageLayout>
  );
}
