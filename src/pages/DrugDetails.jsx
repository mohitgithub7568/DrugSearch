import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getDrugBySplSetId } from "../services/fdaApi";

function displayValue(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "Not listed";
  }

  return value.join(", ");
}

function firstValue(value) {
  if (!Array.isArray(value) || !value[0]) {
    return "Not listed";
  }

  return value[0];
}

function DrugDetails() {
  const { splSetId } = useParams();
  const location = useLocation();

  const [drug, setDrug] = useState(location.state?.drug ?? null);
  const [loading, setLoading] = useState(!location.state?.drug);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (location.state?.drug) {
      return;
    }

    const controller = new AbortController();

    async function loadDrug() {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        const result = await getDrugBySplSetId(splSetId, controller.signal);

        if (!result) {
          setNotFound(true);
          return;
        }

        setDrug(result);
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

    loadDrug();

    return () => controller.abort();
  }, [splSetId, location.state]);

  if (loading) {
    return (
      <main>
        <p>Loading medicine information...</p>
      </main>
    );
  }

  if (notFound) {
    return (
      <main>
        <h1>Medicine not found</h1>
        <Link to="/">Back to search</Link>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Unable to load medicine</h1>
        <p>{error}</p>
        <Link to="/">Back to search</Link>
      </main>
    );
  }

  const openfda = drug.openfda ?? {};

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 text-slate-900">
      <p>
        <Link className="text-sm text-slate-600 hover:text-slate-900" to="/">
          ← Back to search
        </Link>
      </p>

      <h1 className="mt-8 text-3xl font-semibold">
        {displayValue(openfda.brand_name)}
      </h1>

      <p className="mt-2 text-slate-600">
        {displayValue(openfda.generic_name)}
      </p>

      <section className="mt-8 rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Product information</h2>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Manufacturer</dt>
            <dd>{displayValue(openfda.manufacturer_name)}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Product type</dt>
            <dd>{displayValue(openfda.product_type)}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Route</dt>
            <dd>{displayValue(openfda.route)}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Dosage form</dt>
            <dd>{displayValue(openfda.dosage_form)}</dd>
          </div>

          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Active ingredient</dt>
            <dd>{displayValue(openfda.substance_name)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Purpose</h2>
        <p>{firstValue(drug.purpose)}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Indications and usage</h2>
        <p>{firstValue(drug.indications_and_usage)}</p>
      </section>

      <section className="mt-8">
        <h2 className="font-semibold">Warnings</h2>
        <p>{firstValue(drug.warnings)}</p>
      </section>

      <p className="mt-8 text-sm text-slate-500">
        This information comes from public FDA label records and is not medical
        advice.
      </p>
    </main>
  );
}

export default DrugDetails;