export default function uploadInvoiceRequest(axios, data) {
  const { invoice_id, invoice = "" } = data;
  const filename = invoice.split("/").pop();
  const filetype = filename.split(".").pop();
  // const photo = {uri: invoice, name:  filename, type:filetype};

  const photo = { uri: invoice, name: filename, type: "image/png" };
  const body = new FormData();

  body.append("invoice", photo);
  return axios.post(`/cargo/invoice/upload/${invoice_id}`, body, {
    headers: {
      "content-type": "multipart/form-data",
    },
  });
}
