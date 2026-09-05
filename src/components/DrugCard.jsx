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

  const cardContent = (
    <>
      <h2>{displayValue(openfda.brand_name)}</h2>

      <dl>
        <div>
          <dt>Generic name</dt>
          <dd>{displayValue(openfda.generic_name)}</dd>
        </div>

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
      </dl>
    </>
  );

  if (!splSetId) {
    return <article>{cardContent}</article>;
  }

  return (
    <article>
      <Link to={`/drug/${splSetId}`} state={{ drug }}>
        {cardContent}
      </Link>
    </article>
  );
}

export default DrugCard;