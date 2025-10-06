// src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../views/views/Beranda";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/beranda" element={<Login />} />
      </Routes>
    </Router>
  );
}
