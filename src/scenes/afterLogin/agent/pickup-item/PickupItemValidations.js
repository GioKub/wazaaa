import vest, { validate, test, enforce } from "vest";
import truncate from "../../../../utils/truncate.js";
import { isEmail } from "validator";

enforce.extend({ isEmail });

const senderDataValidations = (data, field) => {
  return validate("PickupItemScreen", () => {
    vest.only(field);

    [
      "name",
      "email",
      "phone",
      "address_line_1",
      "address_line_2",
      "postal_code",
      "country_code",
    ].forEach((elem) => {
      test(elem, "This field is required", () => {
        if (typeof data[elem] === "undefined") {
          data[elem] = "";
        }
        enforce(data[elem].toString().trim()).isNotEmpty();
      });
    });

    if (typeof data.email === "undefined") {
      data.email = "";
    }

    test("email", "please use correct email format", () => {
      enforce(data["email"]).matches(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      );
      // enforce(data["email"].toString()).isEmail();
    });
  });
};

export default senderDataValidations;
