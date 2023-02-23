export default function paymentRequest(axios, data) {
  const payload = { invoice_ids: data.invoice_ids };
  switch (data.payment_method) {
    case "ONLINE":
      return axios.post("/billing/payment/method/stripe", payload);
    case "CASH":
      return axios.post("/billing/payment/cash", payload);
    case "BANK":
      return axios.post("/billing/payment/bank", payload);
    case "CARD":
      return axios.post("/billing/payment/card", payload);
    case "LINK":
      return axios.post("/billing/payment/method/bank/link", payload);
    default:
      return Promise.resolve();
  }
}
