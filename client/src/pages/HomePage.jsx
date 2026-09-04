import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { formatCurrency } from '../utils/formatCurrency';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok || !data.success) {
          setError('Could not load products. Please try again.');
          setProducts([]);
          return;
        }

        setProducts(data.products || []);
      } catch {
        if (!cancelled) {
          setError('Unable to reach the server. Is the backend running?');
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#eceff3]">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-900">
              1Fi EMI
            </p>
            <p className="text-xs text-slate-500">
              Mutual fund-backed financing
            </p>
          </div>
          <p className="hidden text-sm text-slate-500 sm:block">
            Flexible EMI plans for electronics
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shop with mutual fund-backed EMI
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse available products, compare finishes, and choose an EMI plan
            that fits your budget.
          </p>
        </header>

        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Available products
          </h2>
          <p className="text-sm text-slate-500">
            {loading ? 'Loading…' : `${products.length} products`}
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : null}

        {error ? (
          <p
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-slate-600">
            No products are available right now.
          </p>
        ) : null}

        {!loading && !error && products.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {product.brand}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">
                  {product.description}
                </p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400 line-through">
                    MRP {formatCurrency(product.mrp)}
                  </p>
                  <span className="mt-4 inline-flex rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                    View EMI plans
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default HomePage;
