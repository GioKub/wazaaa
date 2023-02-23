export default function updateCustomer(axios, data) {
  const { name, phone, email, username } = data;
  return axios.post(`/customer/profile/update`, {
    name: name,
    phone: phone,
    // email: email,
    username: username,
  });
}
