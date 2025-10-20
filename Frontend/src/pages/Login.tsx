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
    <div className="top-0 left-0 w-full h-full bg-cover bg-center z-0">
      <div className="relative z-10 flex items-start justify-center min-h-screen mt-20">
        <form
          className="my-5 md:w-1/4 h-[35rem] flex flex-col gap-3 bg-white/30 backdrop-blur-sm border-amber-300 border-2 p-6 rounded-xl shadow-lg items-center justify-start"
          onSubmit={handleSubmit}
        >
          <div className="text-[1.6rem] font-bold mb-6 mt-[3rem] uppercase text-blue-700">
            <h1>Log in</h1>
          </div>

          <label className="input input-bordered flex items-center gap-2 bg-white w-full">
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              className="grow text-black text-[0.9rem]"
              placeholder="E-mail"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 bg-white w-full">
            <input
              name="password"
              value={password}
              onChange={handleChange}
              type="password"
              className="grow text-black text-[0.9rem]"
              placeholder="Password"
            />
          </label>

          <small className="text-black">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register!
            </Link>
          </small>

          <button
            className="btn btn-primary bg-amber-300 w-full text-black hover:bg-white mt-4 border-2 text-[1.1rem] rounded-3xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
