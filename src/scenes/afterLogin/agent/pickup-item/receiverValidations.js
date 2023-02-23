import vest, { validate, test, enforce } from "vest";
import { truncate } from "../../../../utils/truncate.js";
import { isEmail } from "validator";

const receiverValidations = (data, field) => {
  return validate("AddReciever", () => {
    vest.only(field);
    [
      "name",
      // "email",
      "phone",
      "country_code",
      "address_line_1",
      "address_line_2",
      "country_code",
      "postal_code",
    ].forEach((elem) => {
      test(elem, "This field is required", () => {
        if (typeof data[elem] === "undefined") {
          return false;
        }
        enforce(data[elem].toString().trim()).isNotEmpty();
      });
    });

    test("email", "please use correct email format", () => {
      enforce(data["email"]).matches(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      );
      // enforce(data["email"].toString()).isEmail();
    });
  });
};

export default receiverValidations;
