const BASE_URL = "https://api.fda.gov/drug/label.json";

export async function searchDrugs(brandName, signal) {
  const query = brandName.trim();

  if (!query) {
    return [];
  }

  const params = new URLSearchParams({
    search: `openfda.brand_name:"${query}"`,
    limit: "20",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    signal,
  });

  // search has no matching records.
  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error("Unable to load medicine results. Please try again.");
  }

  const data = await response.json();
  return data.results ?? [];
}

export async function getDrugBySplSetId(splSetId, signal) {
  const params = new URLSearchParams({
    search: `openfda.spl_set_id:"${splSetId}"`,
    limit: "1",
  });

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load this medicine. Please try again.");
  }

  const data = await response.json();
  return data.results?.[0] ?? null;
}