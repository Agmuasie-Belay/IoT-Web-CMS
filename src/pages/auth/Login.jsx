import { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { login } from "../../services/api/authApi";
import { useAuth } from "../../hooks/authContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      // Support common backend response structures
      const token =
        result?.token ??
        result?.data?.token;

      const user =
        result?.user ??
        result?.data?.user;

      if (!token) {
        throw new Error(
          "Login succeeded but no authentication token was returned."
        );
      }

      loginUser(token, user);

      // Return to the page the user originally requested
      const destination =
        location.state?.from?.pathname || "/cms";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">

      {/* Branding section */}
      <div className="hidden bg-gray-900 text-white lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16 xl:px-24">
        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">
            IoT Website
          </p>

          <h1 className="text-4xl font-bold tracking-tight xl:text-5xl">
            Content Management System
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-300">
            Manage website content, people, media, and
            institutional information from one place.
          </p>
        </div>
      </div>

      {/* Login section */}
      <div className="flex min-h-screen w-full items-center justify-center px-6 py-12 lg:min-h-0 lg:w-1/2">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to access the CMS.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            IoT Website CMS
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;