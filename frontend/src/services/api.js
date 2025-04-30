import axios from "axios";

const port = process.env.REACT_APP_PORT || 5005;

//Creates and exports a pre-configured Axios instance for making HTTP requests to the backend API.
const instance = axios.create({
  baseURL: `http://localhost:${port}/api`,
});

export default instance;
