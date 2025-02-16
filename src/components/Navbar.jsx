import { useAuth, useClerk, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-xl py-4 px-6 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wider hover:text-gray-300 transition duration-200"
        >
          TaxAlchemy
        </Link>
        <div className="flex items-center space-x-8">
          {isSignedIn ? (
            <>
              <Link to="/" className="text-lg hover:text-gray-300 transition duration-200">
                Home
              </Link>
              <Link to="/calculator" className="text-lg hover:text-gray-300 transition duration-200">
                Calculator
              </Link>
              <Link to="/history" className="text-lg hover:text-gray-300 transition duration-200">
                History
              </Link>
              <button
                onClick={() => {
                  signOut(() => {
                    window.location.href = "/"; // Redirect to home after sign out
                  });
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-full shadow transition duration-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <SignInButton mode="redirect">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-full shadow transition duration-200">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;