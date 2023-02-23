export default function parcelPaymentInfoRequest(axios, data) {
  return axios.post("/cargo/payment/", data);
}
