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
    <div className="top-0 left-0 w-full h-full bg-cover bg-center z-0">
      <div className="relative z-10 flex items-start justify-center min-h-screen mt-20">
        <form
          className="my-5 md:w-1/4 h-[40rem] flex flex-col gap-3 bg-white/30 backdrop-blur-sm border-amber-300 border-2 p-6 rounded-xl shadow-lg items-center justify-start"
          onSubmit={handleSubmit}
        >
          <div className="text-[1.6rem] font-bold mb-6 mt-[3rem] uppercase text-blue-700 text-center">
            <h1>Create Your Account</h1>
          </div>

          <div className="flex justify-between gap-2 w-full">
            <label className="input input-bordered flex items-center gap-2 bg-white w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="black"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                name="firstName"
                value={firstName}
                onChange={handleChange}
                className="grow text-black"
                placeholder="First Name"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-white w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="black"
                className="h-4 w-4 opacity-70"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              <input
                name="lastName"
                value={lastName}
                onChange={handleChange}
                className="grow text-black"
                placeholder="Last Name"
              />
            </label>
          </div>

          <label className="input input-bordered flex items-center gap-2 bg-white w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="black"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              name="email"
              value={email}
              onChange={handleChange}
              type="email"
              className="grow text-black"
              placeholder="Email"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 bg-white w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="black"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              name="phoneNumber"
              value={phoneNumber}
              onChange={handleChange}
              type="phoneNumber"
              className="grow text-black"
              placeholder="PhoneNumber"
            />
          </label>

          <div className="flex justify-between gap-2 w-full">
            <label className="input input-bordered flex items-center gap-2 bg-white w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="black"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                name="password"
                value={password}
                onChange={handleChange}
                type="password"
                className="grow text-black"
                placeholder="Password"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 bg-white w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="black"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                type="password"
                className="grow text-black"
                placeholder="Confirm Password"
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
            <label htmlFor="host" className="text-black">
              Host
            </label>
          </div>

          <small className="text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in!
            </Link>
          </small>

          <button
            className="btn btn-primary bg-amber-300 w-full text-black hover:bg-white mt-4 border-2 text-[1.1rem] rounded-3xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
