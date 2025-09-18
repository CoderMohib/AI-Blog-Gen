import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./utils/context/AuthContect";
import ProtectedRoute from "./utils/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    // <AuthProvider>
    //   <Router>
    //     <Routes>
    //       {/* Unprotected Routes */}
    //       <Route path="/login" element={<Login />} />
    //       <Route path="/signup" element={<Signup />} />

    //       {/* Protected Routes */}
    //       <Route
    //         path="/dashboard"
    //         element={
    //           <ProtectedRoute>
    //             <Dashboard />
    //           </ProtectedRoute>
    //         }
    //       />

    //       <Route path="*" element={<Login />} />
    //     </Routes>
    //   </Router>
    // </AuthProvider>
     <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center">
      <div className="bg-card border border-border p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">AI Blog Generator</h1>
        <p className="text-text-secondary mb-6">
          This dashboard updates its theme automatically.
        </p>
        <ThemeToggle />
      </div>
    </div>
  );
}

export default App;
