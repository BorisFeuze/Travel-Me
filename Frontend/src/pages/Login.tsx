import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context";
import {
  Globe,
  MapPin,
  Plane,
  UsersRound,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

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

  // 👇 NEW
  const [showPassword, setShowPassword] = useState(false);

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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden lg:grid lg:grid-cols-[1fr_minmax(480px,560px)]">
      {/* Left — Hero (lg+) */}
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1800&auto=format&fit=crop"
          alt="Mountain lake"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Pink gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-pink-500/20 via-fuchsia-600/20 to-rose-600/30" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 border border-white/20 shadow-2xl mb-10">
            <Globe className="h-10 w-10" />
          </div>

          <h1 className="text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-wider mb-6">
            Travel
            <br />
            <span className="bg-linear-to-r from-pink-200 via-white to-pink-200 bg-clip-text text-transparent">
              Me
            </span>
          </h1>

          <p className="text-xl/7 text-white/90 mb-10">
            Skills exchange place without costs
          </p>

          <div className="flex gap-6">
            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all group-hover:scale-105 group-hover:bg-white/15">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="mt-2 text-sm text-white/85 text-center">
                Explore
              </div>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all group-hover:scale-105 group-hover:bg-white/15">
                <Plane className="h-8 w-8" />
              </div>
              <div className="mt-2 text-sm text-white/85 text-center">
                Travel
              </div>
            </div>
            <div className="group">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all group-hover:scale-105 group-hover:bg-white/15">
                <UsersRound className="h-8 w-8" />
              </div>
              <div className="mt-2 text-sm text-white/85 text-center">
                Connect
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 sm:p-10">
        <form
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100"
          onSubmit={handleSubmit}
        >
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-pink-500 to-rose-600 text-white mb-3">
              <Globe className="h-8 w-8" />
            </div>
            <h2 className="text-5xl font-extrabold tracking-wide">
              Travel{" "}
              <span className="bg-linear-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-gray-500">
              Login or create an account to continue
            </p>
          </div>

          <label className="flex flex-col gap-1 mb-4">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              placeholder="your@email.com"
              className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-gray-300 transition"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-gray-700 font-medium">Password</span>
            <div className="relative">
              <input
                name="password"
                value={password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-gray-300 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <input
                id="showPassword"
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label
                htmlFor="showPassword"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Show password
              </label>
            </div>
          </label>

          <div className="mt-5 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-pink-600 hover:underline">
              Register!
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-6 h-12 rounded-xl bg-linear-to-r from-fuchsia-600 to-pink-600 border-0 text-white text-[1.05rem] font-semibold shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                Login <ArrowRight className="inline ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
