function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No variants available for this product.
      </p>
    );
  }

  const groupName = variants[0]?.name || 'Variant';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Choose variant</h3>
        {selectedVariant ? (
          <p className="text-sm text-slate-500">
            {selectedVariant.name}:{' '}
            <span className="font-medium text-slate-800">
              {selectedVariant.value}
            </span>
          </p>
        ) : null}
      </div>

      <div
        className="mt-3 flex flex-wrap gap-2"
        role="group"
        aria-label={`${groupName} options`}
      >
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              aria-pressed={isSelected}
              className={`rounded-xl border px-3.5 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
              }`}
            >
              {variant.value}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
