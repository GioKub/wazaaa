export default function getClientAddress(axios, data) {
  return axios.get("/customer/address", data);
}
