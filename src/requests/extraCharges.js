export default function extraCharges(axios, data) {
  return axios.post("billing/payment/method/extra", data);
}
