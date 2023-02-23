export default function loginRequest(axios, data) {
  return axios.post("/billing/calculate/coupon", data);
}
