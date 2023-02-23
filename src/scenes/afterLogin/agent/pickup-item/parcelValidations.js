import vest, { validate, test, enforce } from "vest";

const parcelValidations = (data, field) => {
  // console.log(data, "valdiation222");
  return validate("AddReciever", () => {
    vest.only(field);

    [
      "tracking_number",
      "weight",
      "item_price",
      "item_currency_code",
      "description",
      // "currency",
      // "note",
    ].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem] ? data[elem].toString() : data[elem]).isNotEmpty();
      });
    });
    test("tracking_number", "Must be longer than 3 characters", () => {
      enforce(data.tracking_number.toString()).longerThanOrEquals(4);
    });

    test("item_currency_code", "Must be exactly 3 characters", () => {
      enforce(data.item_currency_code.toString().length).equals(3);
    });
    test("item_currency_code", "Must be all capitalized characters", () => {
      enforce(data.item_currency_code.toString()).matches(/^[A-Z]{3}$/g);
    });
    test("weight", "weight must be a number", () => {
      enforce(data.weight.toString()).isNumeric();
    });
    // test("currency", "Must be exactly 3 characters", () => {
    //   enforce(data.currency.toString().length).equals(3);
    // });
    // test("currency", "Must be all capitalized characters", () => {
    //   enforce(data.currency.toString()).matches(/^[A-Z]{3}$/g);
    // });
  });
};

export default parcelValidations;
