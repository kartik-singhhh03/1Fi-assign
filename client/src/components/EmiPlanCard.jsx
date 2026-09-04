import { formatCurrency } from '../utils/formatCurrency';

function hasCashback(cashback) {
  return (
    cashback !== null &&
    cashback !== undefined &&
    cashback !== '' &&
    Number(cashback) > 0
  );
}

function EmiPlanCard({ plan, selected, onSelect }) {
  const interestLabel =
    Number(plan.interestRate) === 0
      ? '0% interest'
      : `${plan.interestRate}% interest`;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(plan)}
      className={`w-full rounded-xl border px-3.5 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
        selected
          ? 'border-slate-900 bg-slate-50'
          : 'border-slate-200 bg-white hover:border-slate-400'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
            selected ? 'border-slate-900' : 'border-slate-400'
          }`}
          aria-hidden="true"
        >
          {selected ? (
            <span className="h-2 w-2 rounded-full bg-slate-900" />
          ) : null}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div>
              <p className="text-[15px] font-semibold leading-tight text-slate-900 sm:text-base">
                {formatCurrency(plan.monthlyAmount)}{' '}
                <span className="font-medium text-slate-600">/ month</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {plan.tenure} months
              </p>
            </div>
            <p className="text-sm font-medium text-slate-700">{interestLabel}</p>
          </div>

          {hasCashback(plan.cashback) ? (
            <p className="mt-2 text-sm text-emerald-700">
              Additional cashback of {formatCurrency(plan.cashback)}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  );
}

export default EmiPlanCard;
