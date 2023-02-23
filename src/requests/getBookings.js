export default function getBookings(axios, data) {
  const { start } = data;
  // for retrieving bookings: `customer/bookings?start=0`
  // if you want to first ten you enter 0, if you want from 15 to 25
  // you enter 15, it retreives 10 since x
  return axios.get(`staff/bookings?start=${start}`);
}
