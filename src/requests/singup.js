export default function loginRequest(axios, data) {
  return axios.post("/auth/customer/signup", data);
}
