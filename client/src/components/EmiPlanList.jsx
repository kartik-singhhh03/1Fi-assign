import EmiPlanCard from './EmiPlanCard';

function EmiPlanList({ plans, selectedEmiPlan, onSelect }) {
  if (!plans || plans.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
        No EMI plans are available for this product right now.
      </p>
    );
  }

  return (
    <div
      className="space-y-3"
      role="radiogroup"
      aria-label="EMI plans"
    >
      {plans.map((plan) => (
        <EmiPlanCard
          key={plan.id}
          plan={plan}
          selected={selectedEmiPlan?.id === plan.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default EmiPlanList;
