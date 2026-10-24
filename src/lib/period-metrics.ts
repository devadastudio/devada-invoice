"use client";

export interface PeriodMetricData {
  billed: number;
  collected: number;
  pending: number;
  overdue: number;
  invoicesCount: number;
  overdueCount: number;
  periodLabel: string;
  rate: string;
}

export interface ChartBarItem {
  id: string;
  label: string;
  shortLabel: string;
  billed: number;
  collected: number;
  pending: number;
}

export const PERIOD_METRICS_MAP: Record<string, PeriodMetricData> = {
  "all-time": {
    billed: 155200000,
    collected: 145910000,
    pending: 9290000,
    overdue: 2150000,
    invoicesCount: 134,
    overdueCount: 4,
    periodLabel: "Depuis le début (Cumul)",
    rate: "94.0%",
  },
  "year-2026": {
    billed: 44600000,
    collected: 39180000,
    pending: 5420000,
    overdue: 1650000,
    invoicesCount: 50,
    overdueCount: 4,
    periodLabel: "Année 2026",
    rate: "87.8%",
  },
  "s2-2026": {
    billed: 23200000,
    collected: 19280000,
    pending: 3920000,
    overdue: 1050000,
    invoicesCount: 28,
    overdueCount: 3,
    periodLabel: "2ème Semestre (S2 2026)",
    rate: "83.1%",
  },
  "s1-2026": {
    billed: 21400000,
    collected: 19900000,
    pending: 1500000,
    overdue: 600000,
    invoicesCount: 22,
    overdueCount: 1,
    periodLabel: "1er Semestre (S1 2026)",
    rate: "93.0%",
  },
  "t4-2026": {
    billed: 8450000,
    collected: 5230000,
    pending: 3220000,
    overdue: 650000,
    invoicesCount: 12,
    overdueCount: 4,
    periodLabel: "4ème Trimestre (T4 2026)",
    rate: "61.9%",
  },
  "t3-2026": {
    billed: 22850000,
    collected: 21250000,
    pending: 1600000,
    overdue: 1000000,
    invoicesCount: 24,
    overdueCount: 2,
    periodLabel: "3ème Trimestre (T3 2026)",
    rate: "93.0%",
  },
  "t2-2026": {
    billed: 19550000,
    collected: 18100000,
    pending: 1450000,
    overdue: 450000,
    invoicesCount: 20,
    overdueCount: 1,
    periodLabel: "2ème Trimestre (T2 2026)",
    rate: "92.6%",
  },
  "t1-2026": {
    billed: 18300000,
    collected: 17200000,
    pending: 1100000,
    overdue: 350000,
    invoicesCount: 18,
    overdueCount: 1,
    periodLabel: "1er Trimestre (T1 2026)",
    rate: "94.0%",
  },
  "oct-2026": {
    billed: 8450000,
    collected: 5230000,
    pending: 3220000,
    overdue: 650000,
    invoicesCount: 50,
    overdueCount: 4,
    periodLabel: "Octobre 2026",
    rate: "61.9%",
  },
  "sep-2026": {
    billed: 8100000,
    collected: 7600000,
    pending: 500000,
    overdue: 350000,
    invoicesCount: 45,
    overdueCount: 2,
    periodLabel: "Septembre 2026",
    rate: "93.8%",
  },
  "aou-2026": {
    billed: 6900000,
    collected: 6450000,
    pending: 450000,
    overdue: 250000,
    invoicesCount: 39,
    overdueCount: 1,
    periodLabel: "Août 2026",
    rate: "93.5%",
  },
  "jui-2026": {
    billed: 7850000,
    collected: 7200000,
    pending: 650000,
    overdue: 400000,
    invoicesCount: 34,
    overdueCount: 2,
    periodLabel: "Juillet 2026",
    rate: "91.7%",
  },
  "jun-2026": {
    billed: 6400000,
    collected: 6100000,
    pending: 300000,
    overdue: 200000,
    invoicesCount: 30,
    overdueCount: 1,
    periodLabel: "Juin 2026",
    rate: "95.3%",
  },
  "mai-2026": {
    billed: 5950000,
    collected: 5650000,
    pending: 300000,
    overdue: 150000,
    invoicesCount: 28,
    overdueCount: 1,
    periodLabel: "Mai 2026",
    rate: "95.0%",
  },
  "avr-2026": {
    billed: 7200000,
    collected: 6350000,
    pending: 850000,
    overdue: 100000,
    invoicesCount: 25,
    overdueCount: 1,
    periodLabel: "Avril 2026",
    rate: "88.2%",
  },
  "mar-2026": {
    billed: 6800000,
    collected: 6500000,
    pending: 300000,
    overdue: 100000,
    invoicesCount: 24,
    overdueCount: 1,
    periodLabel: "Mars 2026",
    rate: "95.6%",
  },
  "fev-2026": {
    billed: 5400000,
    collected: 5150000,
    pending: 250000,
    overdue: 100000,
    invoicesCount: 20,
    overdueCount: 1,
    periodLabel: "Février 2026",
    rate: "95.4%",
  },
  "jan-2026": {
    billed: 6100000,
    collected: 5550000,
    pending: 550000,
    overdue: 150000,
    invoicesCount: 18,
    overdueCount: 1,
    periodLabel: "Janvier 2026",
    rate: "91.0%",
  },
  "year-2025": {
    billed: 62400000,
    collected: 59800000,
    pending: 2600000,
    overdue: 500000,
    invoicesCount: 42,
    overdueCount: 1,
    periodLabel: "Année 2025",
    rate: "95.8%",
  },
  "year-2024": {
    billed: 48200000,
    collected: 46930000,
    pending: 1270000,
    overdue: 300000,
    invoicesCount: 36,
    overdueCount: 1,
    periodLabel: "Année 2024",
    rate: "97.4%",
  },
};

/**
 * Returns customized chart bar series according to the selected period filter
 */
export function getChartBreakdownForPeriod(periodId: string): {
  bars: ChartBarItem[];
  yCeiling: number;
  periodLabel: string;
  rate: string;
  totals: { billed: number; collected: number; pending: number };
} {
  const fallback = PERIOD_METRICS_MAP["oct-2026"];
  const current = PERIOD_METRICS_MAP[periodId] || fallback;

  // 1. All-time (cumulative) -> 3 years bars
  if (periodId === "all-time") {
    return {
      bars: [
        { id: "2024", label: "Exercice 2024", shortLabel: "2024", billed: 48200000, collected: 46930000, pending: 1270000 },
        { id: "2025", label: "Exercice 2025", shortLabel: "2025", billed: 62400000, collected: 59800000, pending: 2600000 },
        { id: "2026", label: "Exercice 2026", shortLabel: "2026", billed: 44600000, collected: 39180000, pending: 5420000 },
      ],
      yCeiling: 70000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  // 2. Full year 2026 -> 4 Quarters
  if (periodId === "year-2026") {
    return {
      bars: [
        { id: "q1", label: "Trimestre 1 (Jan-Mar)", shortLabel: "T1", billed: 18300000, collected: 17200000, pending: 1100000 },
        { id: "q2", label: "Trimestre 2 (Avr-Juin)", shortLabel: "T2", billed: 19550000, collected: 18100000, pending: 1450000 },
        { id: "q3", label: "Trimestre 3 (Juil-Sep)", shortLabel: "T3", billed: 22850000, collected: 21250000, pending: 1600000 },
        { id: "q4", label: "Trimestre 4 (Oct-Déc)", shortLabel: "T4", billed: 8450000, collected: 5230000, pending: 3220000 },
      ],
      yCeiling: 25000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  // 3. Past years (2025, 2024) -> 4 Quarters
  if (periodId === "year-2025") {
    return {
      bars: [
        { id: "q1-25", label: "T1 2025 (Jan-Mar)", shortLabel: "T1", billed: 14500000, collected: 14200000, pending: 300000 },
        { id: "q2-25", label: "T2 2025 (Avr-Juin)", shortLabel: "T2", billed: 15800000, collected: 15400000, pending: 400000 },
        { id: "q3-25", label: "T3 2025 (Juil-Sep)", shortLabel: "T3", billed: 16200000, collected: 15600000, pending: 600000 },
        { id: "q4-25", label: "T4 2025 (Oct-Déc)", shortLabel: "T4", billed: 15900000, collected: 14600000, pending: 1300000 },
      ],
      yCeiling: 20000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  if (periodId === "year-2024") {
    return {
      bars: [
        { id: "q1-24", label: "T1 2024 (Jan-Mar)", shortLabel: "T1", billed: 11000000, collected: 10800000, pending: 200000 },
        { id: "q2-24", label: "T2 2024 (Avr-Juin)", shortLabel: "T2", billed: 12200000, collected: 11950000, pending: 250000 },
        { id: "q3-24", label: "T3 2024 (Juil-Sep)", shortLabel: "T3", billed: 12500000, collected: 12200000, pending: 300000 },
        { id: "q4-24", label: "T4 2024 (Oct-Déc)", shortLabel: "T4", billed: 12500000, collected: 11980000, pending: 520000 },
      ],
      yCeiling: 15000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  // 4. Semesters (S1 or S2) -> 6 months
  if (periodId === "s1-2026") {
    return {
      bars: [
        { id: "jan", label: "Janvier 2026", shortLabel: "Jan", billed: 6100000, collected: 5550000, pending: 550000 },
        { id: "fev", label: "Février 2026", shortLabel: "Fév", billed: 5400000, collected: 5150000, pending: 250000 },
        { id: "mar", label: "Mars 2026", shortLabel: "Mar", billed: 6800000, collected: 6500000, pending: 300000 },
        { id: "avr", label: "Avril 2026", shortLabel: "Avr", billed: 7200000, collected: 6350000, pending: 850000 },
        { id: "mai", label: "Mai 2026", shortLabel: "Mai", billed: 5950000, collected: 5650000, pending: 300000 },
        { id: "jun", label: "Juin 2026", shortLabel: "Juin", billed: 6400000, collected: 6100000, pending: 300000 },
      ],
      yCeiling: 8000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  if (periodId === "s2-2026") {
    return {
      bars: [
        { id: "jui", label: "Juillet 2026", shortLabel: "Juil", billed: 7850000, collected: 7200000, pending: 650000 },
        { id: "aou", label: "Août 2026", shortLabel: "Août", billed: 6900000, collected: 6450000, pending: 450000 },
        { id: "sep", label: "Septembre 2026", shortLabel: "Sept", billed: 8100000, collected: 7600000, pending: 500000 },
        { id: "oct", label: "Octobre 2026", shortLabel: "Oct", billed: 8450000, collected: 5230000, pending: 3220000 },
        { id: "nov", label: "Novembre 2026 (Prév.)", shortLabel: "Nov", billed: 5200000, collected: 3800000, pending: 1400000 },
        { id: "dec", label: "Décembre 2026 (Prév.)", shortLabel: "Déc", billed: 6100000, collected: 4500000, pending: 1600000 },
      ],
      yCeiling: 10000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  // 5. Quarters (T1, T2, T3, T4) -> 3 months
  if (periodId === "t1-2026") {
    return {
      bars: [
        { id: "jan", label: "Janvier 2026", shortLabel: "Janvier", billed: 6100000, collected: 5550000, pending: 550000 },
        { id: "fev", label: "Février 2026", shortLabel: "Février", billed: 5400000, collected: 5150000, pending: 250000 },
        { id: "mar", label: "Mars 2026", shortLabel: "Mars", billed: 6800000, collected: 6500000, pending: 300000 },
      ],
      yCeiling: 8000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  if (periodId === "t2-2026") {
    return {
      bars: [
        { id: "avr", label: "Avril 2026", shortLabel: "Avril", billed: 7200000, collected: 6350000, pending: 850000 },
        { id: "mai", label: "Mai 2026", shortLabel: "Mai", billed: 5950000, collected: 5650000, pending: 300000 },
        { id: "jun", label: "Juin 2026", shortLabel: "Juin", billed: 6400000, collected: 6100000, pending: 300000 },
      ],
      yCeiling: 8000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  if (periodId === "t3-2026") {
    return {
      bars: [
        { id: "jui", label: "Juillet 2026", shortLabel: "Juillet", billed: 7850000, collected: 7200000, pending: 650000 },
        { id: "aou", label: "Août 2026", shortLabel: "Août", billed: 6900000, collected: 6450000, pending: 450000 },
        { id: "sep", label: "Septembre 2026", shortLabel: "Septembre", billed: 8100000, collected: 7600000, pending: 500000 },
      ],
      yCeiling: 9000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  if (periodId === "t4-2026") {
    return {
      bars: [
        { id: "oct", label: "Octobre 2026", shortLabel: "Octobre", billed: 8450000, collected: 5230000, pending: 3220000 },
        { id: "nov", label: "Novembre 2026 (Prév.)", shortLabel: "Novembre", billed: 5200000, collected: 3800000, pending: 1400000 },
        { id: "dec", label: "Décembre 2026 (Prév.)", shortLabel: "Décembre", billed: 6100000, collected: 4500000, pending: 1600000 },
      ],
      yCeiling: 10000000,
      periodLabel: current.periodLabel,
      rate: current.rate,
      totals: { billed: current.billed, collected: current.collected, pending: current.pending },
    };
  }

  // 6. Specific month (oct-2026, sep-2026, etc.) -> 4 weekly bars of that month
  const totalBilled = current.billed;
  const totalCollected = current.collected;
  const totalPending = current.pending;

  const w1Billed = Math.round(totalBilled * 0.22);
  const w1Collected = Math.round(totalCollected * 0.26);
  const w1Pending = Math.max(0, w1Billed - w1Collected);

  const w2Billed = Math.round(totalBilled * 0.28);
  const w2Collected = Math.round(totalCollected * 0.29);
  const w2Pending = Math.max(0, w2Billed - w2Collected);

  const w3Billed = Math.round(totalBilled * 0.26);
  const w3Collected = Math.round(totalCollected * 0.25);
  const w3Pending = Math.max(0, w3Billed - w3Collected);

  const w4Billed = totalBilled - (w1Billed + w2Billed + w3Billed);
  const w4Collected = totalCollected - (w1Collected + w2Collected + w3Collected);
  const w4Pending = totalPending - (w1Pending + w2Pending + w3Pending);

  return {
    bars: [
      { id: "w1", label: "Semaine 1 (01 - 07)", shortLabel: "Sem. 1", billed: w1Billed, collected: w1Collected, pending: w1Pending },
      { id: "w2", label: "Semaine 2 (08 - 14)", shortLabel: "Sem. 2", billed: w2Billed, collected: w2Collected, pending: w2Pending },
      { id: "w3", label: "Semaine 3 (15 - 21)", shortLabel: "Sem. 3", billed: w3Billed, collected: w3Collected, pending: w3Pending },
      { id: "w4", label: "Semaine 4 (22 - Fin)", shortLabel: "Sem. 4", billed: w4Billed, collected: w4Collected, pending: Math.max(0, w4Pending) },
    ],
    yCeiling: Math.max(3000000, Math.ceil((w2Billed * 1.3) / 1000000) * 1000000),
    periodLabel: current.periodLabel,
    rate: current.rate,
    totals: { billed: current.billed, collected: current.collected, pending: current.pending },
  };
}

/**
 * Test whether an invoice issueDate falls within the given periodId
 */
export function isInvoiceInPeriod(issueDate: string, periodId: string): boolean {
  if (!periodId || periodId === "all-time") return true;
  if (!issueDate) return false;

  const parts = issueDate.split("-");
  if (parts.length < 2) return true;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10); // 1-12

  switch (periodId) {
    case "oct-2026":
      return year === 2026 && month === 10;
    case "sep-2026":
      return year === 2026 && month === 9;
    case "aou-2026":
      return year === 2026 && month === 8;
    case "jui-2026":
      return year === 2026 && month === 7;
    case "jun-2026":
      return year === 2026 && month === 6;
    case "mai-2026":
      return year === 2026 && month === 5;
    case "avr-2026":
      return year === 2026 && month === 4;
    case "mar-2026":
      return year === 2026 && month === 3;
    case "fev-2026":
      return year === 2026 && month === 2;
    case "jan-2026":
      return year === 2026 && month === 1;

    case "t4-2026":
      return year === 2026 && month >= 10 && month <= 12;
    case "t3-2026":
      return year === 2026 && month >= 7 && month <= 9;
    case "t2-2026":
      return year === 2026 && month >= 4 && month <= 6;
    case "t1-2026":
      return year === 2026 && month >= 1 && month <= 3;

    case "s2-2026":
      return year === 2026 && month >= 7 && month <= 12;
    case "s1-2026":
      return year === 2026 && month >= 1 && month <= 6;

    case "year-2026":
      return year === 2026;
    case "year-2025":
      return year === 2025;
    case "year-2024":
      return year === 2024;

    default:
      return true;
  }
}

