import vest, { validate, test, enforce } from "vest";
import { isEmail } from "validator";

enforce.extend({ isEmail });

const UpdateCustomerValidations = (data, field) => {
  return validate("UpdateCustomerValidations", () => {
    vest.only(field);
    //makes sure username and password fields are not empty
    ["phone", "name", "username"].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem]).longerThan(0);
      });
    });
    ["phone", "username"].forEach((elem) => {
      test(elem, "field can't contain empty spaces", () => {
        enforce(data[elem].toString().replace(/\s/g, "").length).equals(
          data[elem].toString().length
        );
      });
    });
    test("username", "Username needs to be 5 characters or longer", () => {
      enforce(data["username"].toString()).longerThanOrEquals(5);
    });
    test("name", "this field can't contain any digits", () => {
      enforce(data["name"].toString()).notMatches("[0-9]");
    });
    test("name", "this field can't start or end with empty spaces", () => {
      enforce(data["name"].toString().trim().length).equals(
        data["name"].toString().length
      );
    });
    // test("email", "please use correct email format", () => {
    //   enforce(data["email"].toString()).isEmail();
    // });
    // this doesn;t work, it doesn't catch for dsg234124
    test("phone", "this field can't contain letters", () => {
      enforce(data["phone"].toString()).matches("[0-9]");
    });
  });
};

export default UpdateCustomerValidations;
