import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_FLUXCI_API_KEY;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  timeout: 20000,
  headers: apiKey ? { "X-API-Key": apiKey } : undefined,
});

export default api;