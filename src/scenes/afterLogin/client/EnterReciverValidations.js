import vest, { validate, test, enforce } from "vest";
import { isEmail } from "validator";

enforce.extend({ isEmail });

const EnterRecieverValidations = (data, field) => {
  return validate("EnterRecieverValidations", () => {
    vest.only(field);
    //makes sure username and password fields are not empty
    ["name", "phone", "line_1", "postal_code"].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem]).longerThan(0);
      });
    });

    test("phone", "Phone filed must contain only numbers", () => {
      enforce(data["phone"]).isNumeric();
    });
    test("postal_code", "Phone filed must contain only numbers", () => {
      enforce(data["postal_code"]).isNumeric();
    });
    if (data["email"].length > 0) {
      console.log("there is at least 1 character written in email fieldb");
      test("email", "please use correct email format", () => {
        enforce(data["email"].toString()).isEmail();
      });
    } else {
      console.log("email field is empty");
      test("email", "please use correct23232323 email format", () => {});
    }
  });
};

export default EnterRecieverValidations;
