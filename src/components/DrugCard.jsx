import { Link } from "react-router-dom";

function displayValue(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return "Not listed";
  }

  return value.join(", ");
}

function DrugCard({ drug }) {
  const openfda = drug.openfda ?? {};
  const splSetId = openfda.spl_set_id?.[0];
  const cardClass =
  "rounded-md border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm";

  const cardContent = (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
  {displayValue(openfda.brand_name)}
</h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Generic name</dt>
          <dd className="text-slate-900">{displayValue(openfda.generic_name)}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Manufacturer</dt>
          <dd className="text-slate-900">{displayValue(openfda.manufacturer_name)}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Product type</dt>
          <dd className="text-slate-900">{displayValue(openfda.product_type)}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Route</dt>
          <dd className="text-slate-900">{displayValue(openfda.route)}</dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Dosage form</dt>
          <dd className="text-slate-900">{displayValue(openfda.dosage_form)}</dd>
        </div>
      </dl>
    </>
  );

  if (!splSetId) {
    return <article className={cardClass}>{cardContent}</article>;
  }

  return (
    <article className={cardClass}>
  <Link
    className="block rounded-sm outline-none focus:ring-2 focus:ring-slate-300"
    to={`/drug/${splSetId}`}
    state={{ drug }}
  >
        {cardContent}
      </Link>
    </article>
  );
}

export default DrugCard;