export async function authFetch(url: string, options: RequestInit = {}) {
  const finalOptions: RequestInit = {
    ...options,
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  };

  // 1️⃣ First attempt — request with existing cookies (access_token)
  let response = await fetch(url, finalOptions);

  // If access token is valid → return response
  if (response.status !== 401) {
    return handleJSON(response);
  }

  // 2️⃣ Access Token expired → try refreshing token
  const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  // Refresh token failed → user must login again
  if (!refreshRes.ok) {
    return {
      error: true,
      success: false,
      message: "Session expired. Please login again.",
    };
  }

  // Refresh success → retry original request
  response = await fetch(url, finalOptions);

  return handleJSON(response);
}

// Small helper: always return JSON safely
async function handleJSON(res: Response) {
  try {
    const data = await res.json();
    return data;
  } catch {
    return { error: true, message: "Invalid JSON response" };
  }
}
