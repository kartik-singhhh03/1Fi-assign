import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmiPlanList from '../components/EmiPlanList';
import ProductImage from '../components/ProductImage';
import VariantSelector from '../components/VariantSelector';
import { API_BASE_URL } from '../config';
import { formatCurrency } from '../utils/formatCurrency';

function ProductPage() {
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedEmiPlan, setSelectedEmiPlan] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError(null);
      setProduct(null);
      setSelectedVariant(null);
      setSelectedEmiPlan(null);
      setConfirmation(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (response.status === 404 || data.message === 'Product not found') {
          setError('not_found');
          return;
        }

        if (!response.ok || !data.success || !data.product) {
          setError('server');
          return;
        }

        const nextProduct = data.product;
        const variants = nextProduct.variants || [];

        setProduct(nextProduct);
        setSelectedVariant(variants.length > 0 ? variants[0] : null);
      } catch {
        if (!cancelled) {
          setError('network');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  function handleSelectEmiPlan(plan) {
    setSelectedEmiPlan(plan);
    setConfirmation(null);
  }

  function handleProceed() {
    if (!selectedEmiPlan) {
      return;
    }

    const interestLabel =
      Number(selectedEmiPlan.interestRate) === 0
        ? '0% interest'
        : `${selectedEmiPlan.interestRate}% interest`;

    setConfirmation({
      monthlyAmount: selectedEmiPlan.monthlyAmount,
      tenure: selectedEmiPlan.tenure,
      interestLabel,
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f3f4f6]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
          <div className="mt-6 grid animate-pulse gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="h-[28rem] rounded-3xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-10 w-40 rounded bg-slate-200" />
              <div className="h-5 w-28 rounded bg-slate-200" />
              <div className="h-6 w-56 rounded bg-slate-200" />
              <div className="h-48 rounded-2xl bg-slate-200" />
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error === 'not_found') {
    return (
      <main className="min-h-screen bg-[#f3f4f6]">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
          <p className="mt-2 text-slate-600">
            We could not find a product for this URL.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  if (error === 'network' || error === 'server' || !product) {
    return (
      <main className="min-h-screen bg-[#f3f4f6]">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-slate-600">
            {error === 'network'
              ? 'Unable to reach the server. Please check that the backend is running.'
              : 'We could not load this product right now. Please try again.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          to="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← All products
        </Link>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left: product visual card */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-semibold tracking-wide text-rose-600">
              NEW
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-1 text-base text-slate-500">
              {selectedVariant ? selectedVariant.value : product.brand}
            </p>

            <div className="mt-6">
              <ProductImage
                variant={selectedVariant}
                productName={product.name}
              />
            </div>

            <div className="mt-6">
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={setSelectedVariant}
              />
            </div>
          </section>

          {/* Right: price + EMI */}
          <section className="space-y-7 lg:pt-2">
            <div>
              <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {formatCurrency(product.price)}
              </p>
              <p className="mt-2 text-lg text-slate-400 line-through">
                {formatCurrency(product.mrp)}
              </p>
              {product.description ? (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
                  {product.description}
                </p>
              ) : null}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                EMI plans backed by mutual funds
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Select one plan to continue.
              </p>
              <div className="mt-4">
                <EmiPlanList
                  plans={product.emiPlans}
                  selectedEmiPlan={selectedEmiPlan}
                  onSelect={handleSelectEmiPlan}
                />
              </div>
            </div>

            <div className="sticky bottom-4 space-y-3 sm:static">
              <button
                type="button"
                onClick={handleProceed}
                disabled={!selectedEmiPlan}
                aria-disabled={!selectedEmiPlan}
                className={`w-full rounded-2xl px-4 py-3.5 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                  selectedEmiPlan
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                {selectedEmiPlan
                  ? 'Proceed with selected plan'
                  : 'Select an EMI plan to proceed'}
              </button>

              {confirmation ? (
                <div
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                  role="status"
                >
                  <p className="font-medium">You selected:</p>
                  <p className="mt-1">
                    {formatCurrency(confirmation.monthlyAmount)} ×{' '}
                    {confirmation.tenure} months
                  </p>
                  <p className="text-emerald-800">{confirmation.interestLabel}</p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
