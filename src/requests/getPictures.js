export default function getPictures(axios, data) {
  const { tracking_number } = data;
  return axios.get(`/pictures?tracking_number=${tracking_number}`);
}
