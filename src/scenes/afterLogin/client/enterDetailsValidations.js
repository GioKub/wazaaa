import vest, { validate, test, enforce } from "vest";

const EnterDetailsVaildations = (data, field) => {
  return validate("EnterRecieverValidations", () => {
    vest.only(field);
    //makes sure username and password fields are not empty
    ["weight", "dimensions", "value"].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem]).longerThan(0);
      });
    });
  });
};

export default EnterDetailsVaildations;
