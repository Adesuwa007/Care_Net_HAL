import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientProfile from "./pages/PatientProfile";
import AddPatient from "./pages/AddPatient";
import TransferRecords from "./pages/TransferRecords";

function App() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<AddPatient />} />
          <Route path="/patients/:id" element={<PatientProfile />} />
          <Route path="/transfer" element={<TransferRecords />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
