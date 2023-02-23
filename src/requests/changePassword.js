export default function changePassword(axios, data) {
  return axios.post("/auth/update/password", data);
}
