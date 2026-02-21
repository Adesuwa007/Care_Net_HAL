import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    console.log("[CARE-NET API]", config.method?.toUpperCase(), config.url, config.params || config.data || "");
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || "Request failed";
    if (typeof window !== "undefined") {
      console.error("[CARE-NET API Error]", message);
    }
    return Promise.reject(new Error(message));
  }
);

export async function getPatients(filters = {}) {
  const params = {};
  if (filters.riskLevel) params.riskLevel = filters.riskLevel;
  if (filters.disease) params.disease = filters.disease;
  if (filters.hospital) params.hospital = filters.hospital;
  const { data } = await instance.get("/api/patients", { params });
  return data;
}

export async function getPatient(id) {
  const { data } = await instance.get(`/api/patients/${id}`);
  return data;
}

export async function createPatient(body) {
  const { data } = await instance.post("/api/patients", body);
  return data;
}

export async function updatePatient(id, body) {
  const { data } = await instance.put(`/api/patients/${id}`, body);
  return data;
}

export async function assessPatient(id) {
  const { data } = await instance.post(`/api/patients/${id}/assess`);
  return data;
}

export async function transferPatient(id, body) {
  const { data } = await instance.post(`/api/transfer/${id}`, body);
  return data;
}

export async function getTransferHistory(id) {
  const { data } = await instance.get(`/api/transfer/${id}/history`);
  return data;
}

export async function getSchemes(patientId) {
  const { data } = await instance.get(`/api/schemes/recommend/${patientId}`);
  return data;
}

export async function enrollScheme(patientId, schemeName) {
  const { data } = await instance.post(`/api/schemes/enroll/${patientId}`, { schemeName });
  return data;
}

export async function getAnalytics() {
  const { data } = await instance.get("/api/analytics/overview");
  return data;
}

export async function getAnalyticsTrends() {
  const { data } = await instance.get("/api/analytics/trends");
  return data;
}

export async function addAppointment(patientId, body) {
  const { data } = await instance.post(`/api/patients/${patientId}/appointment`, body);
  return data;
}
