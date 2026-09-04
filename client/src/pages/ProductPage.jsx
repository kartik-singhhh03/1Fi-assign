import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmiPlanList from '../components/EmiPlanList';
import ProductGallery from '../components/ProductGallery';
import VariantSelector from '../components/VariantSelector';
import { API_BASE_URL } from '../config';
import { formatCurrency } from '../utils/formatCurrency';

function getSavings(mrp, price) {
  const mrpAmount = Number(mrp);
  const priceAmount = Number(price);

  if (
    Number.isNaN(mrpAmount) ||
    Number.isNaN(priceAmount) ||
    mrpAmount <= priceAmount
  ) {
    return null;
  }

  return mrpAmount - priceAmount;
}

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

  function handleSelectVariant(variant) {
    setSelectedVariant(variant);
  }

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
      <main className="min-h-screen bg-[#eceff3]">
        <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-4 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-5 grid animate-pulse gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="aspect-square rounded-2xl bg-slate-200" />
            <div className="space-y-4">
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-8 w-2/3 rounded bg-slate-200" />
              <div className="h-10 w-40 rounded bg-slate-200" />
              <div className="h-64 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error === 'not_found') {
    return (
      <main className="min-h-screen bg-[#eceff3]">
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Product not found
          </h1>
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
      <main className="min-h-screen bg-[#eceff3]">
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

  const savings = getSavings(product.mrp, product.price);
  const variants = product.variants || [];
  const emiPlans = product.emiPlans || [];

  return (
    <main className="min-h-screen bg-[#eceff3]">
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-slate-800">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/" className="hover:text-slate-800">
                Products
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-800">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-4 grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-7">
          <ProductGallery
            productName={product.name}
            variants={variants}
            selectedVariant={selectedVariant}
            onSelect={handleSelectVariant}
          />

          <div className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                {product.brand}
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>

              {selectedVariant ? (
                <p className="mt-1.5 text-sm text-slate-500">
                  {selectedVariant.name}: {selectedVariant.value}
                </p>
              ) : null}

              <div className="mt-4">
                <p className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {formatCurrency(product.price)}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-base text-slate-400 line-through">
                    MRP {formatCurrency(product.mrp)}
                  </p>
                  {savings !== null ? (
                    <p className="text-sm font-medium text-emerald-700">
                      You save {formatCurrency(savings)}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  Mutual fund-backed EMI
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  Flexible EMI plans
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                  Secure financing
                </span>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <VariantSelector
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelect={handleSelectVariant}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                EMI Plans backed by mutual funds
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose a tenure that works for you.
              </p>

              <div className="mt-4">
                <EmiPlanList
                  plans={emiPlans}
                  selectedEmiPlan={selectedEmiPlan}
                  onSelect={handleSelectEmiPlan}
                />
              </div>

              <div className="sticky bottom-3 mt-5 space-y-3 sm:static">
                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={!selectedEmiPlan}
                  aria-disabled={!selectedEmiPlan}
                  className={`w-full rounded-xl px-4 py-3.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:text-base ${
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
                    className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
                    role="status"
                  >
                    <p className="font-semibold">Plan selected</p>
                    <p className="mt-1">
                      {formatCurrency(confirmation.monthlyAmount)} / month
                    </p>
                    <p>
                      {confirmation.tenure} months · {confirmation.interestLabel}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          </div>
        </div>

        {product.description ? (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-base font-semibold text-slate-900">
              About this product
            </h2>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </section>
        ) : null}

        <section className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Database-backed product details
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Multiple EMI options
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            Flexible tenure selection
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductPage;
