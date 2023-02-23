import vest, { validate, test, enforce } from "vest";
import { isEmail } from "validator";

enforce.extend({ isEmail });

const UpdateCustomerAddressValidations = (data, field) => {
  return validate("UpdateCustomerValidations", () => {
    vest.only(field);
    //makes sure username and password fields are not empty
    ["address_line_1", "address_line_2", "address_postal_code"].forEach(
      (elem) => {
        test(elem, "This field can't be empty", () => {
          enforce(data[elem]).longerThan(0);
        });
      }
    );
  });
};

export default UpdateCustomerAddressValidations;
