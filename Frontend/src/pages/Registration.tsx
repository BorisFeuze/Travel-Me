import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "@/context";

const Register = () => {
  const [
    {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      roles,
    },
    setForm,
  ] = useState<Omit<RegisterData, "_id">>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: undefined,
    confirmPassword: "",
    roles: ["volunteer"],
  });

  const { handleRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      ) {
        throw new Error("All fields are required");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{12,}$/;
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
        phoneNumber,
        confirmPassword,
        roles,
      });

      toast.success("Successfully registered");
      navigate("/login");
    } catch (error: unknown) {
      const message = (error as { message: string }).message;
      toast.error(message);
      console.error(error);
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
            type="password"
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
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full shadow-sm focus:ring-2 focus:ring-gray-400 transition"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="host"
          checked={roles.includes("host")}
          onChange={(e) => {
            setForm((prev) => ({
              ...prev,
              roles: e.target.checked ? ["host"] : ["volunteer"],
            }));
          }}
        />
        <label htmlFor="host" className="text-gray-700">
          Host
        </label>
      </div>

      <small className="text-gray-600 text-center">
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
