export default function cargosRequest(axios, data) {
  const { status } = data;
  return axios.get(`/customer/cargos?start=0&payment_status=${status}`);
}
