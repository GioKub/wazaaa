import vest, { validate, test, enforce } from "vest";

const BookFromUKValidations = (data, field) => {
  return validate("PickupItemScreen", () => {
    vest.only(field);

    if (field !== "parcels_count") {
      ["address_line_1", "address_line_2", "address_postal_code"].forEach(
        (elem) => {
          test(elem, "This field is required", () => {
            enforce(data[elem].toString()).isNotEmpty();
          });
        }
      );
    } else {
      test(field, "This field is required", () => {
        enforce(data[field].toString()).isNotEmpty();
      });
      test(field, "Parcel count must be numeric", () => {
        enforce(data[field]).isNumeric();
      });
      if (!isNaN(data[field])) {
        test(field, "Parcel count must be at least 1", () => {
          enforce(data[field]).greaterThanOrEquals(1);
        });
      }
      // test(field, "parcel count can't be less than 1", () => {
      //   enforce(data[field].toString().)
      // });
    }
  });
};

export default BookFromUKValidations;
