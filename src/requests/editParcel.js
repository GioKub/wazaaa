export default function editParcel(axios, data) {
  return axios.post("/cargo/edit", data);
}
