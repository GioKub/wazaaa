export default function loginRequest(axios, data) {
  return axios.post("/auth/staff", data);
}
