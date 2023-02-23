export default function logout(axios) {
  return axios.post("/auth/staff/logout");
}
