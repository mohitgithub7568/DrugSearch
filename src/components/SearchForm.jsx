import { useState } from "react";

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="brand-name">Search medicine by brand name</label>

      <div>
        <input
          id="brand-name"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Example: Advil"
          autoComplete="off"
        />

        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;