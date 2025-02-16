import { SignUp, SignUpButton, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
          Join the Revolution
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Create your account to transform how you manage your taxes and unlock smarter financial decisions.
        </p>

        <SignUp path="/sign-up" routing="path" />

        <div className="mt-6 text-center">
          <SignUpButton mode="modal" afterSignUpUrl="/">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow transition duration-300">
              Sign Up with Clerk
            </button>
          </SignUpButton>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
