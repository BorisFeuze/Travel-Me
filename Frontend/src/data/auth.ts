import { authServiceURL } from "@/utils";

const baseURL: string = `${authServiceURL}/auth`;

const login = async (formData: LoginData): Promise<SuccessRes> => {
  const res = await fetch(`${baseURL}/login`, {
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
  const res = await fetch(`${baseURL}/me`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();
  // console.log(data);
  return data;
};

const logout = async () => {
  const res = await fetch(`${baseURL}/logout`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Something went wrong!");

  const data = await res.json();
  return data;
};

const register = async (
  formData: Omit<RegisterData, "_id">
): Promise<SuccessRes> => {
  const res = await fetch(`${baseURL}/register`, {
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
