function ProductImage({ variant, productName }) {
  if (!variant || !variant.image) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
        No image available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <img
        src={variant.image}
        alt={`${productName} - ${variant.value}`}
        className="aspect-square w-full object-cover"
      />
    </div>
  );
}

export default ProductImage;
