import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomePage2 from "./pages/HomePage2";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/2" element={<HomePage2 />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

