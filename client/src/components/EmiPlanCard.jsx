import { formatCurrency } from '../utils/formatCurrency';

function EmiPlanCard({ plan, selected, onSelect }) {
  const interestLabel =
    Number(plan.interestRate) === 0
      ? '0% interest'
      : `${plan.interestRate}% interest`;

  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-emerald-600 bg-emerald-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-400'
      }`}
      aria-pressed={selected}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            selected ? 'border-emerald-600' : 'border-slate-400'
          }`}
          aria-hidden="true"
        >
          {selected ? (
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-900">
            {formatCurrency(plan.monthlyAmount)} × {plan.tenure} months
          </p>
          <p className="mt-1 text-sm text-slate-600">{interestLabel}</p>

          {plan.cashback ? (
            <p className="mt-2 text-sm font-medium text-emerald-700">
              Additional cashback of {formatCurrency(plan.cashback)}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default EmiPlanCard;
