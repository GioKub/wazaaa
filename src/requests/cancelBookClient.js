export default function cancelBookClient(axios, data) {
  return axios.post("/customer/booking/cancel", data);
}
