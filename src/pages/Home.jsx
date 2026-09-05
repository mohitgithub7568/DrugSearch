import { useRef, useState } from "react";
import SearchForm from "../components/SearchForm";
import { searchDrugs } from "../services/fdaApi";
import DrugCard from "../components/DrugCard";
function Home() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const cache = useRef(new Map());
  const activeController = useRef(null);

  async function handleSearch(rawQuery) {
    const query = rawQuery.trim();
    const cacheKey = query.toLowerCase();

    if (!query) {
      return;
    }

    activeController.current?.abort();

    setHasSearched(true);
    setLastQuery(query);
    setError("");

    if (cache.current.has(cacheKey)) {
      setResults(cache.current.get(cacheKey));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    activeController.current = controller;

    setLoading(true);
    setResults([]);

    try {
      const drugs = await searchDrugs(query, controller.signal);

      cache.current.set(cacheKey, drugs);
      setResults(drugs);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setError(requestError.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  return (
  <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
    <div className="mx-auto max-w-3xl">
      <header>
  <p className="text-sm font-medium text-slate-500">FDA drug labels</p>

  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
    Drug Search
  </h1>

  <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
    Search public FDA drug label information by brand name.
  </p>
</header>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {!hasSearched && (
        <p className="mt-8 text-sm text-slate-600">
  Search for a medicine to see its label information.
</p>
      )}

      {loading && <p className="mt-8 text-sm text-slate-600" role="status" aria-live="polite">
  Searching FDA drug labels...
</p>}

      {!loading && error && (
       <section
  className="mt-8 rounded-md border border-red-200 bg-red-50 p-4"
  role="alert"
>
  <p className="text-sm text-red-800">{error}</p>

  <button
    className="mt-3 rounded-md bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
    onClick={() => handleSearch(lastQuery)}
  >
    Try again
  </button>
</section>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <p className="mt-8 text-sm text-slate-600">
  No results found for "{lastQuery}".
</p>
      )}

      {!loading && !error && results.length > 0 && (
        <section className="mt-8">
          <p className="text-sm text-slate-600">
  Found {results.length} result{results.length === 1 ? "" : "s"} for "
  {lastQuery}".
</p>
            <div className="mt-4 space-y-3">
  {results.map((drug, index) => (
    <DrugCard
      key={drug.id ?? drug.openfda?.spl_set_id?.[0] ?? index}
      drug={drug}
    />
  ))}
</div>
          
        </section>
      )}
      </div>
    </main>
  );
}

export default Home;