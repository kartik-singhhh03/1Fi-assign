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

    setConfirmation(
      `You selected the ${selectedEmiPlan.tenure}-month EMI plan at ${formatCurrency(selectedEmiPlan.monthlyAmount)} per month.`
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="aspect-square rounded-2xl bg-slate-200" />
              <div className="space-y-4">
                <div className="h-8 w-2/3 rounded bg-slate-200" />
                <div className="h-4 w-1/3 rounded bg-slate-200" />
                <div className="h-20 rounded bg-slate-200" />
                <div className="h-40 rounded bg-slate-200" />
              </div>
            </div>
          </div>
          <p className="mt-6 text-slate-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error === 'not_found') {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Product not found</h1>
          <p className="mt-2 text-slate-600">
            We could not find a product for this URL.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  if (error === 'network' || error === 'server' || !product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
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
            className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← All products
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImage variant={selectedVariant} productName={product.name} />

          <section className="space-y-8">
            <div>
              <p className="text-sm font-medium text-slate-500">{product.brand}</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">
                {product.name}
              </h1>
              {product.description ? (
                <p className="mt-3 text-slate-600">{product.description}</p>
              ) : null}

              <div className="mt-5">
                <p className="text-3xl font-semibold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="mt-1 text-base text-slate-500 line-through">
                  MRP {formatCurrency(product.mrp)}
                </p>
              </div>
            </div>

            <VariantSelector
              variants={product.variants}
              selectedVariant={selectedVariant}
              onSelect={setSelectedVariant}
            />

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                EMI Plans backed by mutual funds
              </h2>
              <p className="mt-1 text-sm text-slate-600">
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

            <div>
              <button
                type="button"
                onClick={handleProceed}
                disabled={!selectedEmiPlan}
                className={`w-full rounded-xl px-4 py-3 text-base font-semibold transition ${
                  selectedEmiPlan
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-200 text-slate-500'
                }`}
              >
                Proceed with selected plan
              </button>

              {confirmation ? (
                <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {confirmation}
                </p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
