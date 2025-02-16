import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser, useAuth, RedirectToSignIn } from "@clerk/clerk-react";

const TaxHistory = () => {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!isSignedIn) {
          console.log("User is not signed in yet.");
          return;
        }
        
        const token = await getToken();
        console.log("TaxHistory - Token being sent:", token);
        if (!token) throw new Error("Unauthorized. Please log in.");

        const response = await fetch("http://localhost:5710/api/tax/records", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("TaxHistory - Response status:", response.status);
        const data = await response.json();
        console.log("TaxHistory - Response data:", data);
        if (!response.ok) throw new Error(data.error || "Failed to fetch tax history.");

        setHistory(data);
      } catch (err) {
        console.error("Error fetching tax history:", err);
        setError(err.message);
      }
    };

    fetchHistory();
  }, [isSignedIn, getToken]);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-md">
        Tax Calculation History
      </h1>
      {error && <p className="text-red-500 text-xl mb-4">{error}</p>}
      {history.length === 0 && !error ? (
        <p className="text-gray-400 text-xl">No tax history found.</p>
      ) : (
        <ul className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-2xl">
          {history.map((item, index) => (
            <li key={index} className="border-b border-gray-700 pb-4 mb-4">
              <p className="text-2xl font-medium text-gray-200">
                Taxable Income: <span className="text-indigo-400">₹{item.taxableIncome}</span>
              </p>
              <p className="text-2xl font-bold text-red-400">
                Tax Payable: <span className="text-red-500">₹{item.taxPayable}</span>
              </p>
              {item.suggestion && (
                <p className="text-xl text-gray-300 mt-2">
                  <strong>Suggestion:</strong> {item.suggestion}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <Link
        to="/"
        className="mt-8 inline-block bg-indigo-700 hover:bg-indigo-800 text-white px-8 py-4 rounded-full shadow-lg transition-all duration-200 text-xl"
      >
        Back to Calculator
      </Link>
    </div>
  );
};

export default TaxHistory;
