import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { SchemesV1 } from "./pages/schemes/SchemesV1";
import { SchemesV2 } from "./pages/schemes/SchemesV2";
import { SchemesV3 } from "./pages/schemes/SchemesV3";
import { Property } from "./pages/Property";
import { PaymentDetails } from "./pages/PaymentDetails";
import { Settings } from "./pages/Settings";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/schemes-1" element={<SchemesV1 />} />
          <Route path="/schemes-2" element={<SchemesV2 />} />
          <Route path="/schemes-3" element={<SchemesV3 />} />
          <Route path="/property" element={<Property />} />
          <Route path="/payment-details" element={<PaymentDetails />} />
          <Route path="/settings" element={<Settings />} />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
