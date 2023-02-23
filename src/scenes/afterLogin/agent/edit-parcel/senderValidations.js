import vest, { validate, test, enforce } from "vest";
import truncate from "../../../../utils/truncate.js";
import { isEmail } from "validator";

enforce.extend({ isEmail });

const senderValidations = (data, field) => {
  return validate("EditUser", () => {
    vest.only(field);

    [
      "name",
      "email",
      "phone",
      "country_code",
      "address_line_1",
      // "address_line_2",
      "postal_code",
    ].forEach((elem) => {
      test(elem, "This field is required", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
    });

    test("email", "please use correct email format", () => {
      enforce(data["email"].toString()).isEmail();
    });
  });
};

export default senderValidations;
