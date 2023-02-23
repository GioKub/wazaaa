export default function getGargosRequest(axios, data = {}) {
  return axios.post("/cargo", data);
}
