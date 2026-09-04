function ProductImage({ variant, productName }) {
  if (!variant || !variant.image) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-500">
        No image available
      </div>
    );
  }

  return (
    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
      <img
        src={variant.image}
        alt={`${productName} in ${variant.value}`}
        className="h-full w-full object-contain object-center"
      />
    </div>
  );
}

export default ProductImage;
