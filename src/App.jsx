import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";      // public homepage
import TaxCalculator from "./components/TaxCalculator";
import TaxHistory from "./components/TaxHistory";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <Routes>
            {/* Public Home Page */}
            <Route path="/" element={<HomePage />} />

            {/* Public Routes */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/calculator"
              element={
                <SignedIn>
                  <TaxCalculator />
                </SignedIn>
              }
            />
            <Route
              path="/history"
              element={
                <SignedIn>
                  <TaxHistory />
                </SignedIn>
              }
            />

            {/* Catch-all: Redirect unknown paths to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Tax Calculator. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
