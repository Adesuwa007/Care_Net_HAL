import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import AddPatient from "./pages/AddPatient";
import TransferRecords from "./pages/TransferRecords";
import Schemes from "./pages/Schemes";
import Login from "./pages/login";
import Analytics from "./pages/Analytics";
import NearbyServices from "./pages/NearbyServices";
import SystemLogs from "./pages/SystemLogs";
import Prescription from "./pages/Prescription";
import Chatbot from "./components/Chatbot";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <>
      <div className="flex min-h-screen bg-slate-950">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/patients" element={<PatientList />} />
                      <Route path="/patients/new" element={<AddPatient />} />
                      <Route path="/patients/:id" element={<PatientProfile />} />
                      <Route path="/transfer" element={<TransferRecords />} />
                      <Route path="/nearby" element={<NearbyServices />} />
                      <Route path="/schemes" element={<Schemes />} />
                      <Route path="/logs" element={<SystemLogs />} />
                      <Route path="/prescription/:patientId" element={<Prescription />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Chatbot />
    </>
  );
}

export default App;

