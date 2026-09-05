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
    <main>
      <h1>Drug Search</h1>

      <p>Search public FDA drug label information by brand name.</p>

      <SearchForm onSearch={handleSearch} loading={loading} />

      {!hasSearched && (
        <p>Search for a medicine to see its label information.</p>
      )}

      {loading && <p>Searching FDA drug labels...</p>}

      {!loading && error && (
        <section>
          <p>{error}</p>
          <button onClick={() => handleSearch(lastQuery)}>Try again</button>
        </section>
      )}

      {!loading && !error && hasSearched && results.length === 0 && (
        <p>No results found for "{lastQuery}".</p>
      )}

      {!loading && !error && results.length > 0 && (
        <section>
          <p>
            Found {results.length} result{results.length === 1 ? "" : "s"} for "
            {lastQuery}".
          </p>
            <div>
  {results.map((drug, index) => (
    <DrugCard
      key={drug.id ?? drug.openfda?.spl_set_id?.[0] ?? index}
      drug={drug}
    />
  ))}
</div>
          
        </section>
      )}
    </main>
  );
}

export default Home;