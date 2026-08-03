import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue using LexAI"
    >
      <form className="space-y-5">

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
        />

        <div className="flex justify-end">
          <Link
            to="#"
            className="text-sm text-cyan-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          variant="primary"
          type="submit"
        >
          Login
        </Button>

        <p className="text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}

export default LoginPage;