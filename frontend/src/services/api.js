import axios from "axios";

//Creates and exports a pre-configured Axios instance for making HTTP requests to the backend API.
const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

export default instance;
