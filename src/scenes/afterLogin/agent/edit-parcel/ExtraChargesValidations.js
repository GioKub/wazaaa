import vest, { validate, test, enforce } from "vest";

const extraChargesValidations = (data, field) => {
  // console.log(data, "valdiation222");
  return validate("AddReciever", () => {
    vest.only(field);
    ["note", "amount"].forEach((elem) => {
      test(elem, "This field is required", () => {
        // enforce(data[elem].toString().length).equals(3);
        enforce(data[elem] ? data[elem].toString() : data[elem]).isNotEmpty();
      });
    });

    test("amount", "Amount must be number", () => {
      enforce(data.amount).isNumeric();
    });
    test("currency", "Must be exactly 3 characters", () => {
      enforce(data.currency.toString().length).equals(3);
    });
    test("currency", "Must be all capitalized characters", () => {
      enforce(data.currency.toString()).matches(/^[A-Z]{3}$/g);
    });
  });
};

export default extraChargesValidations;
