import vest, { validate, test, enforce } from "vest";
import { isEmail } from "validator";

//makes isEmail useable by enfore, wihout this vest
//can't acces isEmail and you are show 'isEmail is imported but
//value never used' warning
enforce.extend({ isEmail });

const singupScreenValidations = (data, field) => {
  return validate("ResetPasswordScreen", () => {
    vest.only(field);
    test("email", "please use correct email format", () => {
      enforce(data["email"].toString()).isEmail();
    });
  });
};

export default singupScreenValidations;
