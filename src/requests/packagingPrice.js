export default function packagingPrice(axios) {
  return axios.get("/config/packaging");
}
