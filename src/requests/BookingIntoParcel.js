export default function BookingIntoParcel(axios, data) {
  /*
    {
        "booking_id" : 34,
        "item_ids": [1]
    }
    */
  return axios.post("/staff/booking/items/proceed", data);
}
