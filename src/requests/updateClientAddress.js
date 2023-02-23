export default function updateClientAddress(axios, data) {
  return axios.post("/customer/address", data);
}
