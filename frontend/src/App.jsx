import { Routes, Route } from "react-router-dom";
import Register from "./register/register";
import Login from "./login/login";
import Dashboard from "./dashboard/dashboard";
import ProtectedRoute from "./login/ProtectedRoute";
import PublicRoute from "./login/PublicRoute";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
