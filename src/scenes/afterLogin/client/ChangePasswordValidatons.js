import vest, { validate, test, enforce } from "vest";

const changePasswordValidations = (data, field) => {
  return validate("ChangePasswordScreen", () => {
    vest.only(field);
    //makes sure username and password fields are not empty
    ["currentPassword", "newPassword", "confirmNewPassword"].forEach((elem) => {
      test(elem, "This field can't be empty", () => {
        enforce(data[elem]).longerThan(0);
      });
    });

    ["newPassword", "confirmNewPassword"].forEach((elem) => {
      test(elem, "Password can't be shorter than 8 characters", () => {
        enforce(data[elem]).longerThan(7);
      });
    });

    test(
      "confirmNewPassword",
      "this field need to be same as password field",
      () => {
        enforce(data["confirmNewPassword"].toString()).equals(
          data["newPassword"]
        );
      }
    );
  });
};

export default changePasswordValidations;
