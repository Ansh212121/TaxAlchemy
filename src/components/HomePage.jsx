import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

function HomePage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col text-white">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-indigo-400 to-green-400 text-transparent bg-clip-text drop-shadow-lg mb-6 animate-fadeIn">
          Empower Your Financial Future
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl leading-relaxed animate-slideUp">
          Unlock the power of smart tax planning to maximize your savings and secure a prosperous tomorrow.
        </p>
      </div>

      {/* Information Card */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 my-10 shadow-2xl hover:scale-105 transition-transform duration-300">
        <h2 className="text-4xl font-bold text-center mb-5 text-indigo-400">
          Why Manage Your Taxes?
        </h2>
        <p className="text-lg text-gray-300 leading-relaxed">
          Effective tax planning is the key to optimizing your finances. By understanding your liabilities and leveraging deductions, 
          you can save more, invest smarter, and pave the way for a secure future. Our intuitive tax calculator simplifies the process, 
          making it easier than ever to take control of your financial destiny.
        </p>
      </div>

      {/* Call-to-Action Section */}
      <div className="flex flex-col items-center mb-20 animate-fadeIn">
        {isSignedIn ? (
          <Link
            to="/calculator"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105"
          >
            Get Started
          </Link>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/login"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-8 mt-auto border-t border-gray-700">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-indigo-400">Need Help?</h3>
          <p className="text-lg mt-3">
            📞 Contact Us: <span className="font-semibold">+91 9897829737</span> | 📧 <span className="font-semibold">ansh2109ag@gmail.com</span>
          </p>
          <p className="text-lg mt-3 opacity-80">
            © {new Date().getFullYear()} <span className="font-semibold text-green-400">TaxAlchemy</span>. All rights reserved By Ansh Agarwal.
          </p>
        </div>
      </footer>
    </div>
  );
}
export default HomePage;