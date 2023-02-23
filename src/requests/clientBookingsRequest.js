export default function clientBookingsRequest(axios, data) {
  const { start } = data;
  return axios.get(`/customer/bookings`, {
    params: {
      start: start,
    },
  });
}
