import vest, { validate, test, enforce } from "vest";

const receiverValidations = (data, field) => {
  return validate("EditUser", () => {
    vest.only(field);

    ["name", "phone", "country_code", "address_line_1", "address_line_2", "postal_code"].forEach(
      (elem) => {
        test(elem, "This field is required", () => {
          enforce(data[elem].toString()).isNotEmpty();
        });
      }
    );
  });
};

export default receiverValidations;
