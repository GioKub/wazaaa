export default function getAllPriviledges(axios, data) {
  return axios.get("/staff/privileges", data);
}
