import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="appointments" element={<div className="text-gray-800 p-4 bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center font-semibold text-xl">Appointments Module Placeholder</div>} />
          <Route path="beds" element={<div className="text-gray-800 p-4 bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center font-semibold text-xl">Bed Management Module Placeholder</div>} />
          <Route path="*" element={<div className="text-gray-800 p-4 bg-white rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center font-semibold text-xl">Module Under Construction</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
