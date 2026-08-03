import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

function SignupPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join LexAI and start smarter legal research."
    >
      <form className="space-y-5">

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          required
        />

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            className="mt-1"
          />

          <label className="text-sm text-slate-400">
            I agree to the{" "}
            <span className="text-cyan-400 cursor-pointer hover:underline">
              Terms & Conditions
            </span>
          </label>
        </div>

        <Button
          variant="primary"
          type="submit"
          className="w-full"
        >
          Create Account
        </Button>

        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-cyan-400 hover:underline"
          >
            Login
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}

export default SignupPage;