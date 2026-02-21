import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import AddPatient from "./pages/AddPatient";
import TransferRecords from "./pages/TransferRecords";
import Schemes from "./pages/Schemes";
import Login from "./pages/login";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
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
                    <Route path="/patients" element={<PatientList />} />
                    <Route path="/patients/new" element={<AddPatient />} />
                    <Route path="/patients/:id" element={<PatientProfile />} />
                    <Route path="/transfer" element={<TransferRecords />} />
                    <Route path="/schemes" element={<Schemes />} />
                  </Routes>
                </main>
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
