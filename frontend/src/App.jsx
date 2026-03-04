import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMe } from "./features/auth/authAPI";

import PrivateRoute from "./components/shared/PrivateRoute";
import AuthRoute from "./components/shared/AuthRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Layout from "./components/layout/Layout";
import AllVitals from "./pages/vitals/AllVitals";
import AddVitals from "./pages/vitals/AddVitals";
import Timeline from "./pages/timeline/Timeline";
import AllReports from "./pages/reports/AllReports";
import UploadReport from "./pages/reports/UploadReport";
import ViewReport from "./pages/reports/ViewReport";
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe()); // Cookie check karo page load pe
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/reports/upload" element={<UploadReport />} />
            <Route path="/reports/:id" element={<ViewReport />} />
            <Route path="/vitals" element={<AllVitals />} />
            <Route path="/vitals/add" element={<AddVitals />} />
          </Route>
        </Route>

        {/* Default */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
