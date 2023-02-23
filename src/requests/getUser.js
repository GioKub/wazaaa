export default function getUser(axios, data) {
  return axios.post("/cargo/findInfo", data);
}
