export default function releaseParcelRequest(axios, data) {
  return axios.post("/cargo/release/tracking", data);
}
