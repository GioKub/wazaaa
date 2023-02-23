import vest, { validate, test, enforce } from "vest";

const EditParcelValidations = (data, field) => {
  return validate("EditUser", () => {
    vest.only(field);

    [
      "tracking_number",
      "weight",
      // "source_country_code",
      // "destination_country_code",
      // "collection_option", //Radio button
      // "customer_type", //Radio button
      // "parcel_type", //Dropdown
      // "notes",
      "description",
      "currency_code",
      "freight_price",
      "delivery_price",
      "item_price",
      "item_currency_code",
    ].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });
    test("item_currency_code", "Must be exactly 3 characters", () => {
      enforce(data.item_currency_code.toString().length).equals(3);
    });
    test("item_currency_code", "Must be all capitalized characters", () => {
      enforce(data.item_currency_code.toString()).matches(/^[A-Z]{3}$/g);
    });
    test("currency_code", "Must be exactly 3 characters", () => {
      enforce(data.currency_code.toString().length).equals(3);
    });
    test("currency_code", "Must be all capitalized characters", () => {
      enforce(data.currency_code.toString()).matches(/^[A-Z]{3}$/g);
    });
  });
};

export default EditParcelValidations;
