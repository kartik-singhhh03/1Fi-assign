function ProductGallery({ productName, variants, selectedVariant, onSelect }) {
  const hasImage = selectedVariant && selectedVariant.image;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex aspect-[4/5] items-center justify-center bg-slate-50 p-4 sm:aspect-square sm:p-6">
        {hasImage ? (
          <img
            src={selectedVariant.image}
            alt={`${productName} in ${selectedVariant.value}`}
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <p className="text-sm text-slate-500">No image available</p>
        )}
      </div>

      {variants && variants.length > 0 ? (
        <div className="border-t border-slate-100 bg-white px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Gallery
          </p>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Product image variants"
          >
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;

              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => onSelect(variant)}
                  aria-pressed={isSelected}
                  aria-label={`Show ${variant.value}`}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                    isSelected
                      ? 'border-slate-900'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {variant.image ? (
                    <img
                      src={variant.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-slate-500">
                      {variant.value}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ProductGallery;
