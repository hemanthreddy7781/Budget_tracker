import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { formatMoney } from '../../lib/currency.ts';
import type { UserSettings } from '../../types/index.ts';

interface Props {
  income: number;
  expenses: number;
  settings: UserSettings;
}

export default function SummaryCards({ income, expenses, settings }: Props) {
  const { currency_symbol: sym, unit_position: pos } = settings;
  const net = income - expenses;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-5.5 mt-1.5">
      {/* Income */}
      <div className="bg-surface border border-border rounded-[16px] sm:rounded-[22px] px-3.5 sm:px-5 lg:px-6 py-4 lg:py-5.5 shadow-(--shadow-card)">
        <div className="flex justify-between items-start">
          <span className="text-[12px] lg:text-[13.5px] font-semibold text-text-muted">Income</span>
          <span className="w-8 h-8 lg:w-9 lg:h-9 rounded-[10px] lg:rounded-[11px] bg-[#e7f6ed] text-income flex items-center justify-center shrink-0">
            <ArrowDownLeft size={16} />
          </span>
        </div>
        <div className="text-base sm:text-xl lg:text-[28px] font-extrabold tracking-[-0.02em] mt-2.5 lg:mt-3.5 tabular-nums">
          {formatMoney(income, sym, pos)}
        </div>
        <div className="text-[11px] lg:text-[12.5px] text-income font-semibold mt-1.5">
          ▲ 8.2% vs last month
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-surface border border-border rounded-[18px] lg:rounded-[22px] px-4 py-4 lg:px-6 lg:py-5.5 shadow-(--shadow-card)">
        <div className="flex justify-between items-start">
          <span className="text-[12px] lg:text-[13.5px] font-semibold text-text-muted">
            Expenses
          </span>
          <span className="w-8 h-8 lg:w-9 lg:h-9 rounded-[10px] lg:rounded-[11px] bg-[#fdeaea] text-expense flex items-center justify-center shrink-0">
            <ArrowUpRight size={16} />
          </span>
        </div>
        <div className="text-[17px] lg:text-[28px] font-extrabold tracking-[-0.02em] mt-2.5 lg:mt-3.5 tabular-nums">
          {formatMoney(expenses, sym, pos)}
        </div>
        <div className="text-[11px] lg:text-[12.5px] text-income font-semibold mt-1.5">
          ▼ 6.1% vs last month
        </div>
      </div>

      {/* Net balance — full width below on mobile/tablet, 1 col on lg+ */}
      <div className="col-span-2 xl:col-span-1 rounded-[18px] lg:rounded-[22px] px-4 py-4 lg:px-6 lg:py-5.5 text-white bg-[linear-gradient(135deg,#2563eb,#0ea5e9)] shadow-[0_12px_28px_color-mix(in_srgb,#2563eb_28%,transparent)]">
        <div className="flex justify-between items-start">
          <span className="text-[12px] lg:text-[13.5px] font-semibold opacity-90">Net balance</span>
          <span className="w-8 h-8 lg:w-9 lg:h-9 rounded-[10px] lg:rounded-[11px] bg-white/22 flex items-center justify-center shrink-0">
            <PiggyBank size={16} />
          </span>
        </div>
        <div className="text-[17px] lg:text-[28px] font-extrabold tracking-[-0.02em] mt-2.5 lg:mt-3.5 tabular-nums">
          {formatMoney(net, sym, pos)}
        </div>
        <div className="text-[11px] lg:text-[12.5px] opacity-90 font-semibold mt-1.5">
          Saved this month
        </div>
      </div>
    </div>
  );
}
