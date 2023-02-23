export default function BookCourierRequest(axios, data) {
  return axios.post("/customer/booking", data);
}
