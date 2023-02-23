import vest, { validate, test, enforce } from "vest";

const loginScreenValidations = (data, field) => {
  return validate("LoginScreen", () => {
    vest.only(field);

    //makes sure username and password fields are not empty
    ["username", "password"].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem].toString()).isNotEmpty();
      });
      //makes sure username and password filed don't have empty spaces not in the end
      //or beginning and not in the middle, that's why regex is used instead of trim()
      //becuase trim only removes whitespaces from end and start
      test(elem, "field can't contain empty spaces", () => {
        enforce(data[elem].toString().replace(/\s/g, "").length).equals(
          data[elem].toString().length
        );
      });
    });
  });
};

export default loginScreenValidations;
