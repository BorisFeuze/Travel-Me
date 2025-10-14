import { VITE_APP_USER_API_URL } from "@/config";

const originalFetch = window.fetch;

const authServiceURL = VITE_APP_USER_API_URL;

window.fetch = async (url, urlToHttpOptions, ...rest) => {
  let response = await originalFetch(
    url,
    { ...urlToHttpOptions, credentials: "include" },
    ...rest
  );
  const autHeader = response.headers.get("www-authenticate");
  if (autHeader?.includes("token_expired")) {
    console.log("ATTEMPT REFRESH");
    const refreshAllToken = await originalFetch(
      `${authServiceURL}/auth/refresh`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!refreshAllToken.ok) throw new Error("login required");

    response = await originalFetch(
      url,
      { ...urlToHttpOptions, credentials: "include" },
      ...rest
    );
  }
  return response;
};

export { authServiceURL };
