export default function getStaff(axios, data) {
  return axios.get("/staff", data);
}
