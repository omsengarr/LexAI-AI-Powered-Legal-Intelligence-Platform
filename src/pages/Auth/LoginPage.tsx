import { useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // ========================================
  // Handle Login
  // ========================================

  function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);


    // ========================================
    // Temporary Frontend Authentication
    // ========================================

    setTimeout(() => {

      localStorage.setItem(
        "lexai_authenticated",
        "true"
      );

      localStorage.setItem(
        "lexai_user_email",
        email
      );

      setLoading(false);

      navigate("/dashboard", {
        replace: true,
      });

    }, 500);
  }


  // ========================================
  // Page
  // ========================================

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue using LexAI"
    >

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

        {/* Email */}

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />


        {/* Password */}

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />


        {/* Forgot Password */}

        <div className="flex justify-end">

          <Link
            to="#"
            className="
              text-sm
              text-cyan-400
              hover:underline
            "
          >
            Forgot Password?
          </Link>

        </div>


        {/* Error */}

        {error && (

          <div
            className="
              rounded-lg
              border
              border-red-500/30
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-400
            "
          >
            {error}
          </div>

        )}


        {/* Login Button */}

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </Button>


        {/* Signup */}

        <p className="text-center text-slate-400">

          Don't have an account?{" "}

          <Link
            to="/signup"
            className="
              text-cyan-400
              hover:underline
            "
          >
            Sign Up
          </Link>

        </p>

      </form>

    </AuthLayout>
  );
}

export default LoginPage;