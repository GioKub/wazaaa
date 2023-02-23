import React, { useState, useEffect } from "react";
import { Text, View, Alert } from "react-native";
import * as SMS from "expo-sms";
// comonenets from ../../../../components/atoms/
import InputWithError from "../../../../components/atoms/InputWithError.js";
import Button from "../../../../components/atoms/Button.js";
import ErrorText from "../../../../components/atoms/ErrorText.js";
// components from ../../../../components/molecules/
import SummaryList from "../../../../components/molecules/SummaryList.js";
import PaymentDropdown from "../../../../components/molecules/PaymentDropdown.js";
// hook components
import useOfflineRequest from "../../../../hooks/useOfflineRequest.js";
import useRequest from "../../../../hooks/useRequest.js";
// request components
import paymentRequest from "../../../../requests/paymentRequest.js";
import uploadInvoiceRequest from "../../../../requests/uploadInvoiceRequest.js";
import getDiscount from "../../../../requests/getDiscount.js";
import getTrackingDuplicates from "../../../../requests/getTrackingDuplicates.js";
// other components
import confirmAlert from "../../../../utils/confirmAlert.js";
import BookingIntoParcel from "../../../../requests/BookingIntoParcel.js";

const Summary = ({ navigation, route: { params } }) => {
  const { parcels = [], } = params;
  // console.log(parcels, "<--parcels");
  const [pickupRequest, requesting] = useOfflineRequest({
    url: "/cargo/pickup",
    method: "POST",
  });
  // console.log(parcels) 

  const [pay, paying] = useRequest(paymentRequest);
  const [uploadInvoice, uploading] = useRequest(uploadInvoiceRequest);
  const [apply, applying] = useRequest(getDiscount);
  const [sendForBooking] = useRequest(BookingIntoParcel);
  const [trackingRequest, requestingTracking] = useRequest(
    getTrackingDuplicates
  );


  const [summaryData, setSummary] = useState({
    coupon_code: "",
    payment_method: "ONLINE",
    // extra_charges: [],
  });
  const [sum, setSum] = useState(0);
  const [errors, setErrors] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [total_discounts, setTotalDiscounts] = useState(0);

  // sums up all the prices, parcel price and all the extra charges added in AddReciever screen
  useEffect(() => {
    let s = 0;
    parcels.forEach((parcel) => {
      s += parcel.price;
      s += parcel.packaging_price;
      if (parcel.extra_charges) {
        parcel.extra_charges.map((extra) => (s += parseFloat(extra.amount)));
      }
    });
    setSum(s);
  }, [parcels]);

  // basically substracts discouts from total price which sum of pracel price and extra charges
  // one thing which triggers it is apply coupon which sets the discounts
  useEffect(() => {
    if (discounts.length) {
      let s = 0;
      let d = 0;
      parcels.forEach((parcel) => {
        s += parcel.price;
        if (parcel.extra_charges) {
          parcel.extra_charges.map((extra) => (s += parseFloat(extra.amount)));
        }
      });
      discounts.forEach((discount) => {
        d += discount;
      });
      setSum(s - d);
      setTotalDiscounts(d);
    }
  }, [discounts]);

  const onChange = (name, value) => {
    setSummary({ ...summaryData, [name]: value });
  };
  const existingTrackings = []
  const allTrackings = []
  for(let i=0;i<parcels.length;i++){
    allTrackings.push(parcels[i].tracking_number)
  }
  console.log(allTrackings, "<---all trackinsg")
  console.log(existingTrackings, "<--existing trackings")
  //#region newCode
  async function getInvoiceIds(parcels) {
    if (parcels.length === 0) return;
    const requests = [];
    try {
      for (const data of parcels) {
        const payload = {
          ...summaryData,
          ...data,
          // invoiceHash: ["asdasd", "sad213123"],
          source_country_code: data.sender.country_code,
          destination_country_code: data.receiver.country_code,
        };
        // console.log(payload, "<--final payload");
        requests.push(
          // POST /cargo/pickup
          pickupRequest(payload)
            // .then(
            //     (res) => {
            //       console.log(res.data.cargo.tracking_number, "<111111111")
            //       console.log(res.data.cargo.invoice.invoice_id, "<2222222")
            //     }
            //     // alert("this is for debugging, please developer if you see this")
            //   )
            .catch((e) => {
              console.error(e.response.data, "<-pikcupRequst failure");
              if (e.response.data.hasOwnProperty("data")) {
                if (
                  e.response.data.data.errors[0] ===
                  "The Sender.email is not valid format"
                ) {
                  alert(
                    "The Sender.email is not valid format",
                    payload.sender.email
                  );
                } else {
                 
                  // alert(e.response.data.data.errors[0] + " : " + payload.tracking_number);
                  existingTrackings.push(payload.tracking_number)
                }
              } else {
                alert("couldn't authorize request");
              }
            })
        );
      }

      // this is causing bug, repsonse is return undefiedn or sometimes wrong thing
      const responses = await Promise.all(requests).catch((e) =>
        console.error(e.response.status, "PromiseAll error")
      );

      // console.log(responses, "<--responses");
      const invoice_ids = responses.map((r) => r.data.cargo.invoice.invoice_id);
      return invoice_ids;
    } catch (error) {
      setErrors(error.message);
      console.error(error);
      // alert(JSON.stringify(error.message));
    }
  }
  // gets called from confirmCheckout() when you click 'checkoit' button
  const checkout = async () => {
    const invoice_ids = await getInvoiceIds(parcels);
    // console.log(invoice_ids, "invoice_ids");
    let hasErrors = false;

    // POST /billing/payment/{payment_method}
    //(extra parameters gets added at the end of url based on paymet method chosen)
    console.log({
      invoice_ids: invoice_ids === undefined ? [] : invoice_ids,
      payment_method: summaryData.payment_method,
    })
    pay({
      invoice_ids: invoice_ids === undefined ? [] : invoice_ids,
      payment_method: summaryData.payment_method,
    })
      .then((res) => {
        // console.log(res)
                Alert.alert(
                  "Done",
                  "Checked out successfully!",
                  [{ text: "Home", onPress: () => navigation.navigate("Home") }]
                  // {cancelable: true}
                );
      })
      .catch((e) => {
        // console.error(e)
        if(existingTrackings.length!==0){
          let sucesfullTrackings = allTrackings.filter(x => !existingTrackings.includes(x))
          console.log(sucesfullTrackings, "<--sucesfull trackings")
          if(sucesfullTrackings.length!==0){
            alert("parcels with these trackings got added: " + sucesfullTrackings.toString() )
          }else{
            alert("all of these tracking numbers already exist!")
          }
        }
        console.error(e.toJSON(), "<-Payment error inside Summary.js");
      });

    makeBookingsFinished()
  };

  const makeBookingsFinished = () =>{

    const idsToSend = [];

    let bookindIdToSend = 0; //same as undefined but it needs to be number here
    console.log(parcels)

    for (let i = 0; i < parcels.length; i++) {
      if (parcels[i].isBooking === true) {
        idsToSend.push(parcels[i].itemIdToSend);
        bookindIdToSend = parcels[i].bookindIdToSend
      }
    }

    console.log(
      {
        booking_id: bookindIdToSend,
        item_ids: idsToSend,
      }
    )

    sendForBooking({
      booking_id: bookindIdToSend,
      item_ids: idsToSend,
    })
      .then((res) => {
        // console.log(res, "<---res111");
      })
      .catch((err) => {
        console.error(err, "<---err222");
      });
  }
  const confirmCheckout = () => {
    confirmAlert({
      paragraph: "Sure you want to checkout?",
      onConfirm: checkout,
    });
  };
  // gets called from confirmCoupon() when you click 'Apply' button
  const applyCoupon = () => {
    const prices = [];
    parcels.forEach((parcel) => {
      let freight_price = parcel.freight_price;
      let delivery_price = parcel.delivery_price;
      let extra_charges = parcel.extra_charges;
      prices.push({ freight_price, delivery_price, extra_charges });
      console.log(prices);
    });
    // POST /billing/calculate/coupon
    apply({ prices, coupon: summaryData.coupon_code })
      .then((r) => {
        // alert(JSON.stringify(r.data));
        setDiscounts(r.data.discounts);
      })
      .catch((e) => {
        console.error(e, "asd");
      });
  };
  const confirmCoupon = () => {
    confirmAlert({
      paragraph: "Sure you want to apply this coupon?",
      onConfirm: applyCoupon,
    });
  };
  // gets called when you click 'Send Summary SMS' button
  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const number = parcels[0].sender.phone;
      let msg = "";
      // Tracking number, tracking link, weight and price
      parcels.forEach((parcel, index) => {
        const p = parcel.price;
        const n = parcel.tracking_number;
        const l = `http://georgiancargo.co.uk/home/${n}`;
        const w = parcel.weight;
        const i = index + 1;
        msg += `${i})\tTracking number: ${n}\n\tTracking link: ${l}\n\tWeight: ${w} KG\n\tPrice: ${p}\n`;
      });
      const { result } = await SMS.sendSMSAsync(number, msg, {});
    } else {
      alert("Failed to open SMS app");
    }
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "white", padding: 15 }}>
        <SummaryList parcels={parcels} discounts={discounts} />
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 20 }}>
            Discount is:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {isNaN(total_discounts)
                ? "Cannot be calculated, please contact administrator"
                : total_discounts}
            </Text>
          </Text>
          <Text style={{ fontSize: 25 }}>
            Sum is:{" "}
            <Text style={{ fontWeight: "bold" }}>
              {isNaN(sum)
                ? "Cannot be calculated, please contact administrator"
                : sum}
            </Text>
          </Text>
        </View>
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 3, marginRight: 5 }}>
              <InputWithError
                name="coupon_code"
                placeholder="Coupon"
                onChangeText={onChange}
                value={summaryData.coupon_code}
              />
            </View>
            <View style={{ flex: 2 }}>
              <Text></Text>
              <Button
                onPress={confirmCoupon}
                loading={applying}
                disabled={requesting || paying || uploading}
              >
                Apply
              </Button>
            </View>
          </View>
          <PaymentDropdown
            link={true}
            allow_no_payment={true}
            name="payment_method"
            onSelect={onChange}
            selectedValue={summaryData.payment_method}
            placeholder="Payment method"
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={sendSMS}
            disabled={requesting || paying || uploading || applying}
          >
            Send Summary SMS
          </Button>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            onPress={confirmCheckout}
            loading={requesting || paying || uploading || applying}
          >
            Checkout
          </Button>
        </View>
      </View>
    </>
  );
};
export default Summary;
