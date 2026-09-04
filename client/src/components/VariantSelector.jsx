function VariantSelector({ variants, selectedVariant, onSelect }) {
  if (!variants || variants.length === 0) {
    return (
      <p className="text-sm text-slate-500">No variants available for this product.</p>
    );
  }

  const groupName = variants[0]?.name || 'Option';

  return (
    <div>
      <p className="text-sm font-medium text-slate-700">{groupName}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isSelected
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500'
              }`}
              aria-pressed={isSelected}
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
