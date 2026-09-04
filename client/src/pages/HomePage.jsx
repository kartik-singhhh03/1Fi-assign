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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <p className="text-sm font-medium text-emerald-700">1Fi EMI</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900">
            Shop with mutual fund-backed EMI
          </h1>
          <p className="mt-2 text-slate-600">
            Choose a product to view variants and EMI plans.
          </p>
        </header>

        {loading ? (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading products...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </p>
        ) : null}

        {!loading && !error ? (
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
                <p className="mt-3 text-xl font-semibold text-slate-900">
                  {formatCurrency(product.price)}
                </p>
                <p className="mt-1 text-sm text-slate-500 line-through">
                  MRP {formatCurrency(product.mrp)}
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
