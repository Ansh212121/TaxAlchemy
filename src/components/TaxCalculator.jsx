import { useState } from "react";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser, useAuth, RedirectToSignIn } from "@clerk/clerk-react";

const TaxCalculator = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [formData, setFormData] = useState({
    annualIncome: "",
    investments: "",
    otherDeductions: "",
    otherIncome: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        setError("Unauthorized: No token found");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5710/api/tax/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
        const history = JSON.parse(localStorage.getItem("taxHistory")) || [];
        localStorage.setItem("taxHistory", JSON.stringify([...history, data]));
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      setError("Error connecting to backend");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <div className="bg-gradient-to-r from-gray-800 via-indigo-900 to-black text-white text-center py-20 px-6 shadow-2xl rounded-b-3xl">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-fadeIn">
          Effortless Tax Calculation
        </h1>
        <p className="text-2xl max-w-2xl mx-auto drop-shadow-md">
          Calculate your tax liability accurately and plan your finances with ease.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-12 p-8 bg-gray-800 rounded-2xl shadow-2xl border border-gray-600 animate-slideUp">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">
          Enter Your Financial Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(formData).map((field) => (
            <div key={field} className="flex flex-col md:flex-row items-center">
              <label className="w-full md:w-1/3 text-xl font-semibold text-gray-300 mb-2 md:mb-0">
                {field.replace(/([A-Z])/g, " $1").trim()}
              </label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="flex-1 w-full p-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:scale-105"
                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full md:w-1/2 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-105"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin mr-2" size={24} /> : "Calculate Tax"}
          </button>
        </form>

        {error && <div className="mt-6 text-center text-red-500 text-xl font-semibold">{error}</div>}

        {result && (
          <div className="mt-10 bg-gray-700 p-8 rounded-2xl shadow-2xl border border-gray-600">
            <h3 className="text-3xl font-bold text-center text-indigo-300 mb-6">
              Your Tax Summary
            </h3>
            <div className="space-y-4 text-xl">
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <span className="font-medium text-gray-200">Taxable Income:</span>
                <span className="text-indigo-400 font-bold">₹{result.taxableIncome}</span>
              </div>
              <div className="flex justify-between border-b border-gray-600 pb-2">
                <span className="font-medium text-gray-200">Tax Payable:</span>
                <span className="text-red-400 font-bold">₹{result.taxPayable}</span>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg shadow-inner text-gray-100">
                <strong>Suggestion:</strong> {result.suggestion}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/history"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-lg shadow-xl transition-all duration-200 text-xl hover:scale-105"
          >
            View Tax History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;
