import { useState } from "react";

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query);
  }

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <label
  className="mb-2 block text-sm font-medium text-slate-700"
  htmlFor="brand-name"
>
  Search by brand name
</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
  id="brand-name"
  type="search"
  value={query}
  onChange={(event) => setQuery(event.target.value)}
  placeholder="Example: Advil"
  autoComplete="off"
/>

        <button className="h-11 bg-slate-900 px-5 text-sm font-medium text-white"  type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchForm;