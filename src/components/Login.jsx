import { SignIn, SignInButton, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Login = () => {
  const { isSignedIn } = useUser();

  // Redirect to homepage if already signed in
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center px-4">
      <div className="bg-gray-800 shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Welcome Back!</h2>
        <p className="text-center text-gray-400 mb-6">
          Sign in to access your dashboard and enjoy exclusive features.
        </p>

        {/* Embedded Clerk sign-in form */}
        <SignIn path="/sign-in" routing="path" redirectUrl="/" />

        {/* Redirecting user to Clerk's hosted sign-in page */}
        <div className="mt-6 text-center">
          <SignInButton mode="redirect" redirectUrl="/">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
              Login with Clerk
            </button>
          </SignInButton>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
