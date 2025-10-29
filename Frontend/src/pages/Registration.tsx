import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context";
import { validateRegistration } from "@/utils";

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

    const validationErrors = validateRegistration({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
    });
    if (Object.keys(validationErrors).length !== 0) {
      return { error: validationErrors, success: false };
    }

    try {
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
    } catch (error: unknown) {
      const message =
        (error as { message: string }).message ?? "Registration failed";
      toast.error(message);
      console.error(error);
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
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <form
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold text-center text-black mb-6 uppercase">
          Create Your Account
        </h1>

        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-gray-700 font-medium">First Name</span>
            <input
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            />
          </label>

          <label className="flex flex-col gap-1 flex-1">
            <span className="text-gray-700 font-medium">Last Name</span>
            <input
              name="lastName"
              value={lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            />
          </label>
        </div>

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
          <span className="text-gray-700 font-medium">Phone Number</span>
          <input
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
          />
        </label>

        <div className="flex gap-2">
          <label className="flex flex-col gap-1 flex-1">
            <span className="text-gray-700 font-medium">Password</span>
            <input
              name="password"
              value={password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            />
          </label>

          <label className="flex flex-col gap-1 flex-1">
            <span className="text-gray-700 font-medium">Confirm Password</span>
            <input
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 mt-1">
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

        <div
          onClick={toggleRole}
          className={`relative mt-4 cursor-pointer rounded-xl p-4 transition-all duration-300 text-center border-2 font-semibold ${
            isHost
              ? "bg-linear-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {isHost ? (
            <div className="flex flex-col items-center transition-all duration-300">
              <span className="text-lg font-bold">🌍 Host Mode Active</span>
              <small className="text-sm opacity-90">
                You can post job offers and host volunteers
              </small>
            </div>
          ) : (
            <div className="flex flex-col items-center transition-all duration-300">
              <span className="text-lg font-bold">🙋 Volunteer Mode</span>
              <small className="text-sm opacity-80">
                Click to become a host and create opportunities
              </small>
            </div>
          )}
        </div>

        <small className="text-gray-600 text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in!
          </Link>
        </small>

        <button
          className="btn btn-primary w-full bg-black text-white mt-4 text-[1.1rem] rounded-3xl"
          disabled={loading}
        >
          {loading ? "Loading..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Register;
