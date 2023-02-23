const parseRequest = (axios, { url, method, data }) => {
  switch (method) {
    case "POST":
      return axios.post(url, data);
    case "PUT":
      return axios.put(url, data);
    case "DELETE":
      return axios.delete(url, data);
    case "GET":
      return axios.get(url);
    default:
      return;
  }
};

export default parseRequest;
