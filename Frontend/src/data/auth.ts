import { authServiceURL } from "@/utils";

const login = async (formData: LoginData): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("Something went wrong!");

  const data = (await res.json()) as SuccessRes;

  return data;
};

const me = async () => {
  const res = await fetch(`${authServiceURL}/auth/me`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();
  return data;
};

const logout = async () => {
  const res = await fetch(`${authServiceURL}/auth/logout`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();
  return data;
};

const register = async (formData: RegisterData): Promise<SuccessRes> => {
  const res = await fetch(`${authServiceURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();
  return data;
};

export { login, me, logout, register };
