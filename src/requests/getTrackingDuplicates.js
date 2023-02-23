export default function getTrackingDuplicates(axios, data) {
  return axios.post("/cargo/track", data);
}
