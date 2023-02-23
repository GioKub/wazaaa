export default function getBookings(axios, data) {
  return axios.get("customer/address", data);
}
