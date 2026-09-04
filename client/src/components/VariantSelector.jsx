const FINISH_COLORS = {
  Silver: '#C8C8C8',
  Orange: '#E87722',
  Blue: '#1E3A5F',
  'Titanium Black': '#2B2B2B',
  'Titanium Gray': '#8B8B8B',
  'Titanium Blue': '#3F5F8A',
  Midnight: '#1C1C1E',
  Starlight: '#F0EBE3',
};

function getFinishColor(value) {
  return FINISH_COLORS[value] || null;
}

function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No variants available for this product.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-slate-500">
        Available in {variants.length} finishes
      </p>

      <div
        className="mt-3 flex flex-wrap items-center gap-3"
        role="group"
        aria-label="Product finishes"
      >
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const color = getFinishColor(variant.value);

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              aria-pressed={isSelected}
              aria-label={variant.value}
              title={variant.value}
              className={`flex items-center gap-2 rounded-full border px-2 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                isSelected
                  ? 'border-slate-900 bg-white shadow-sm'
                  : 'border-transparent bg-transparent hover:border-slate-300'
              }`}
            >
              <span
                className={`h-8 w-8 rounded-full border ${
                  isSelected ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: color || '#e2e8f0',
                  borderColor: color === '#F0EBE3' || color === '#C8C8C8' ? '#cbd5e1' : 'rgba(0,0,0,0.08)',
                }}
                aria-hidden="true"
              />
              <span
                className={`pr-2 text-sm ${
                  isSelected ? 'font-medium text-slate-900' : 'text-slate-600'
                }`}
              >
                {variant.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
