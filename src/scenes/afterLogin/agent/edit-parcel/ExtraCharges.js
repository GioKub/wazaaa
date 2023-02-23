import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import Button from "../../../../components/atoms/Button";
import InputWithError from "../../../../components/atoms/InputWithError";
import ExtraChargesList from "../../../../components/molecules/ExtraChargesList";
import extraCharges from "../../../../requests/extraCharges";
import useRequest from "../../../../hooks/useRequest";
import useValidation from "../../../../hooks/useValidation";
import extraChargesValidations from "./ExtraChargesValidations";

const ExtraCharges = (params) => {
  // console.log(params, "<---params");
  const [newExtra, setNewExtra] = useState([]);
  const [paidFees, setPaidFees] = useState([]);
  // already exising notes that were added from addReciever screen
  const [existingExtra, setExistingExtra] = useState(
    params.route.params.parcels.extra_charges
  );

  const [extra, setExtra] = useState({ note: "", amount: "" });
  // data saved inside this variable is used for sending data for payment
  const [parcel, setParcel] = useState({
    tracking_number: params.route.params.parcels.tracking_number,
    currency: params.route.params.parcels.currency_code,
  });
  // data saved inside this variable is used to set added extra charges
  // to parcel so that we will know this parcel has extra charges and
  // will be able to display small badge on the homescreen
  const [recievedParcel, setRecievedParcel] = useState(
    params.route.params.parcels
  );
  const { errors: extraChargesErrors, validate: validateParcel } =
    useValidation(extraChargesValidations);
  const [add] = useRequest(extraCharges);
  const payed = params.route.params.parcels.payment_status === "PAID";

  console.log(params.route.params.parcels.extra_extra);
  // let discounts = [];

  const sender = params.route.params.parcels.sender;
  const parcelKeys = ["name", "phone", "email"];
  const parcelLabels = ["name", "phone", "email"];

  useEffect(() => {
    let tranformedPaidFees = paidFees;
    let transformedExistingExtra = existingExtra;
    let tranformedNewExtra = [];
    for (let extra of params.route.params.parcels.extra_extra) {
      // if extra charge has been paid
      if (extra.paid === 1) {
        tranformedPaidFees.push({
          amount: extra.total,
          note: extra.description,
        });
        transformedExistingExtra.push({
          amount: extra.total,
          note: extra.description,
        });
      } else {
        tranformedNewExtra.push({
          amount: extra.total,
          note: extra.description,
        });
      }
    }

    setPaidFees(tranformedPaidFees);
    setNewExtra(tranformedNewExtra);
    setExistingExtra(transformedExistingExtra);
  }, [params.route.params.parcels.extra_extra]);

  const onAdd = () => {
    if (
      extra &&
      extra.amount !== 0 &&
      extra.amount.toString() !== "" &&
      extra.note !== ""
    ) {
      add({
        currency: parcel.currency,
        description: extra.note,
        total: extra.amount,
        tracking_number: parcel.tracking_number,
      })
        .then((e) => {
          // setRecievedParcel({
          //   ...recievedParcel,
          //   hasExtraCharges: true,
          // });
          let modifiedNewExtra = newExtra;
          modifiedNewExtra.push({
            amount: extra.amount,
            note: extra.note,
          });
          // console.log(modifiedNewExtra, "modifiedNewExtra");
          setNewExtra(modifiedNewExtra);
          setExtra({ note: "", amount: "" });
          alert("Additional extra charge added successfully!");

          // console.log(e.config.data, "<--payment succesfull");
        })

        .catch((e) =>
          Alert.alert(
            "Failed",
            "Some error occured please try again",
            [
              {
                text: "OK",
              },
            ]
            // {cancelable: true}
          )
        );
    }
  };

  const removeExtraCharge = (index) => {
    const newExtra = existingExtra.slice();
    newExtra.splice(index, 1);
    setExistingExtra(newExtra);
    // setAlert(true);
  };

  const onExtraChange = (name, value) => {
    const add = { ...extra, [name]: value };
    setExtra({ ...extra, [name]: value });
    validateParcel(add, name).catch((e) => {});
  };

  const onChangeParcel = (name, value) => {
    const next = { ...parcel, [name]: value };
    setParcel(next);
    validateParcel(next, name).catch((e) => {});
  };

  const Parcel = () => {
    return parcelKeys.map((key, i) => (
      <View style={styles.row} key={key}>
        <Text style={styles.dd}>{parcelLabels[i]}</Text>
        <Text style={styles.dt}>{sender[key] ? sender[key] : "N/A"}</Text>
      </View>
    ));
  };

  // needs to render: name, phone, email
  return (
    <ScrollView style={styles.container}>
      <Parcel />
      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <View style={{ flex: 2 }}>
          <InputWithError
            error={extraChargesErrors.note}
            name="note"
            placeholder="Note"
            onChangeText={onExtraChange}
            value={extra.note}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 3 }}>
          <InputWithError
            error={extraChargesErrors.amount}
            name="amount"
            placeholder="Amount"
            onChangeText={onExtraChange}
            value={extra.amount}
            // isNumber
          />
        </View>
        <View style={{ flex: 1, marginLeft: 3 }}>
          <InputWithError
            error={extraChargesErrors.currency}
            name="currency"
            placeholder="Currency"
            onChangeText={onChangeParcel}
            value={parcel.currency}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text></Text>
          <Button onPress={onAdd} style={{}}>
            Add
          </Button>
        </View>
      </View>
      <View style={{ marginTop: 2 }}>
        <Text style={styles.extra}>
          {`${payed ? "Payed" : "Unpaid"} Extra Charges`}
        </Text>
        <ExtraChargesList
          pickupScreen={false}
          extra_charges={existingExtra}
          removeExtraCharge={removeExtraCharge}
          // disabled={!editPrices}
        />
        <Text style={styles.extra}>Paid Additional Fees:</Text>
        <ExtraChargesList
          extra_charges={paidFees}
          removeExtraCharge={removeExtraCharge}
        />
        <Text style={styles.extra}>Unpaid Additional Fees:</Text>
        <ExtraChargesList
          extra_charges={newExtra}
          removeExtraCharge={removeExtraCharge}
          // disabled={!editPrices}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { margin: 30 },
  dd: {
    flex: 4.5,
    marginRight: 5,
    fontWeight: "bold",
  },
  dt: { flex: 5 },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    borderColor: "rgba(0,0,0,0.12)",
    borderBottomWidth: 0.5,
  },
  extra: {
    // left: "20%",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "700",
    fontSize: 15,
  },
});

export default ExtraCharges;
