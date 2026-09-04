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
    <main className="min-h-screen bg-[#f3f4f6]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <p className="text-sm font-semibold tracking-wide text-slate-900">
            1Fi EMI
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Shop with mutual fund-backed EMI
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Choose a product to view finishes, pricing, and EMI plans.
          </p>
        </header>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white"
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
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-400 hover:shadow"
              >
                <p className="text-sm text-slate-500">{product.brand}</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  {product.name}
                </h2>
                <p className="mt-4 text-2xl font-bold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="mt-1 text-sm text-slate-400 line-through">
                  {formatCurrency(product.mrp)}
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default HomePage;
