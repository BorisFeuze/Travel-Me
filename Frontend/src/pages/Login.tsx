import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context";

type LoginFormState = {
  email: string;
  password: string;
};

const Login = () => {
  const [{ email, password }, setForm] = useState<LoginFormState>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSignIn } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!email || !password) throw new Error("All fields are required");

      setLoading(true);

      await handleSignIn({ email, password });

      toast.success("Login successfully");
      navigate("/");
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center p-6">
    <form
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-center text-black mb-6 uppercase">
        Log in
      </h1>

      <label className="flex flex-col gap-1">
        <span className="text-gray-700 font-medium">Email</span>
        <input
          name="email"
          value={email}
          onChange={handleChange}
          type="email"
          placeholder="Enter your email"
          className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-gray-700 font-medium">Password</span>
        <input
          name="password"
          value={password}
          onChange={handleChange}
          type="password"
          placeholder="Enter your password"
          className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
        />
      </label>

      <small className="text-gray-600 text-center">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register!
        </Link>
      </small>

      <button
        type="submit"
        className="btn btn-primary w-full bg-black text-white mt-4 border-2 text-[1.1rem] rounded-3xl"
        disabled={loading}
      >
        {loading ? "Loading..." : "Login"}
      </button>
    </form>
  </div>
);


};

export default Login;
