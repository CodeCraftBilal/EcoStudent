export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const finalOptions: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  };

  // First attempt
  let response = await fetch(url, finalOptions);

  if (response.status !== 401) {
    return response; // return Response directly
  }

  // Try refreshing the token
  const refreshRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!refreshRes.ok) {
    // Still return a Response-like object so API is consistent
    return new Response(
      JSON.stringify({
        error: true,
        success: false,
        message: "Session expired. Please login again.",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Retry original request
  response = await fetch(url, finalOptions);

  return response;
}
