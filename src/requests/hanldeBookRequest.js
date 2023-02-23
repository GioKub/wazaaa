export default function handleBookRequest(axios, data) {
  // const { booking_ids = [2], status = "pending"} = data;
  return axios.post("/staff/bookings/proceed", data);
}
