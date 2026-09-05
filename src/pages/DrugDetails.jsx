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
    <main>
      <p>
        <Link to="/">← Back to search</Link>
      </p>

      <h1>{displayValue(openfda.brand_name)}</h1>
      <p>{displayValue(openfda.generic_name)}</p>

      <section>
        <h2>Product information</h2>

        <dl>
          <div>
            <dt>Manufacturer</dt>
            <dd>{displayValue(openfda.manufacturer_name)}</dd>
          </div>

          <div>
            <dt>Product type</dt>
            <dd>{displayValue(openfda.product_type)}</dd>
          </div>

          <div>
            <dt>Route</dt>
            <dd>{displayValue(openfda.route)}</dd>
          </div>

          <div>
            <dt>Dosage form</dt>
            <dd>{displayValue(openfda.dosage_form)}</dd>
          </div>

          <div>
            <dt>Active ingredient</dt>
            <dd>{displayValue(openfda.substance_name)}</dd>
          </div>
        </dl>
      </section>

      <section>
        <h2>Purpose</h2>
        <p>{firstValue(drug.purpose)}</p>
      </section>

      <section>
        <h2>Indications and usage</h2>
        <p>{firstValue(drug.indications_and_usage)}</p>
      </section>

      <section>
        <h2>Warnings</h2>
        <p>{firstValue(drug.warnings)}</p>
      </section>

      <p>
        This information comes from public FDA label records and is not medical
        advice.
      </p>
    </main>
  );
}

export default DrugDetails;