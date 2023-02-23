export default function clientPayments(axios, data) {
  const { start } = data;
  return axios.get(`/customer/payments`, {
    params: {
      start: start,
    },
  });
}
