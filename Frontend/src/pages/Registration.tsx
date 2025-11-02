import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context";
import {
  Globe,
  MapPin,
  Plane,
  UsersRound,
  Home,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

type Role = "volunteer" | "host";

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  roles: Role[];
};

const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    roles: ["volunteer"],
  });

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    roles,
  } = form;

  const { handleRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name as keyof RegisterForm]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !password ||
        !confirmPassword ||
        !phoneNumber
      )
        throw new Error("All fields are required");
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?\":{}|<>]).{12,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error(
          "Password must be at least 12 characters, include one uppercase letter and one special character"
        );
      }

      setLoading(true);

      await handleRegister({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        roles,
      });

      toast.success("Successfully registered!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isHost = roles.includes("host");

  const toggleRole = () => {
    setForm((prev) => ({
      ...prev,
      roles: isHost ? ["volunteer"] : ["host"],
    }));
  };

  return (
    <div className="min-h-screen w-full overflow-hidden lg:grid lg:grid-cols-[1fr_minmax(480px,560px)]">
      {/* Left — Blue Hero */}
      <div className="relative hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2400&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/20 via-sky-600/40 to-cyan-600/40" />
        <div className="relative z-10 h-full w-full flex items-center p-10 xl:p-16 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 shadow-lg mb-8">
              <Globe className="h-10 w-10" />
            </div>

            <h1 className="text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-wider mb-6">
              Travel
              <br />
              <span className="bg-gradient-to-r from-sky-200 via-white to-sky-200 bg-clip-text text-transparent">
                Me
              </span>
            </h1>

            <p className="text-xl/7 text-white/90">
              Join the community. Exchange skills. Travel smarter.
            </p>

            {/* Feature icons */}
            <div className="mt-8 flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <Plane className="h-6 w-6" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <UsersRound className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Registration Form */}
      <div className="flex-1 flex items-center justify-center bg-white px-4 sm:px-6">
        <form
          className="w-full max-w-xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8"
          onSubmit={handleSubmit}
        >
          {/* Mobile brand */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-700 to-cyan-600 text-white mb-3">
              <Globe className="h-8 w-8" />
            </div>
            <h2 className="text-5xl font-extrabold tracking-wide">
              Travel{" "}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Your Account
            </h1>
            <p className="text-gray-500">
              It only takes a minute to get started
            </p>
          </div>

          {/* Name */}
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <label className="flex flex-col gap-1">
              <span className="text-gray-700 font-medium">First Name</span>
              <input
                name="firstName"
                value={firstName}
                onChange={handleChange}
                placeholder="First Name"
                autoComplete="given-name"
                className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-gray-700 font-medium">Last Name</span>
              <input
                name="lastName"
                value={lastName}
                onChange={handleChange}
                placeholder="Last Name"
                autoComplete="family-name"
                className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition"
              />
            </label>
          </div>

          {/* Email */}
          <label className="flex flex-col gap-1 mb-4">
            <span className="text-gray-700 font-medium">Email</span>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              placeholder="your@email.com"
              autoComplete="email"
              className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition"
            />
          </label>

          {/* Phone */}
          <label className="flex flex-col gap-1 mb-4">
            <span className="text-gray-700 font-medium">Phone Number</span>
            <input
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              type="tel"
              placeholder="+49 170 000000"
              autoComplete="tel"
              className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition"
            />
          </label>

          {/* Passwords */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-gray-700 font-medium">Password</span>
              <div className="relative">
                <input
                  name="password"
                  value={password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition pr-12"
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
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-gray-700 font-medium">
                Confirm Password
              </span>
              <input
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                className="input input-bordered w-full h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white shadow-sm focus:ring-2 focus:ring-sky-300 transition"
              />
            </label>
          </div>

          {/* Show password toggle */}
          <div className="flex items-center gap-2 mt-3 mb-4">
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

          {/* Role switch (uses your isHost/toggleRole) */}
          <div
            onClick={toggleRole}
            className={`relative cursor-pointer rounded-2xl p-5 text-center border-2 transition-all duration-300 ${
              isHost
                ? "bg-gradient-to-r from-blue-700 to-cyan-600 text-white border-transparent shadow-lg"
                : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {isHost ? (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold flex items-center gap-2">
                  <Home className="h-5 w-5" /> Host Mode Active
                </span>
                <small className="opacity-90">
                  You can post job offers and host volunteers
                </small>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold flex items-center gap-2">
                  <UsersRound className="h-5 w-5" /> Volunteer Mode
                </span>
                <small className="opacity-80">
                  Click to become a host and create opportunities
                </small>
              </div>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in!
            </Link>
          </div>

          <button
            className="btn btn-primary w-full mt-6 h-12 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 border-0 text-white text-[1.05rem] font-semibold shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                Create Account <ArrowRight className="inline ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
