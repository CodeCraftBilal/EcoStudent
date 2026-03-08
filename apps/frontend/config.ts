const getFrontendUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
};

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // For local testing (PC or physical mobile device on same network)
    const isLocal = 
      hostname === "localhost" || 
      hostname === "127.0.0.1" || 
      hostname.startsWith("192.168.") || 
      hostname.startsWith("10.");
      
    if (isLocal) {
      return `${window.location.protocol}//${hostname}:8000`;
    }
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
};

export const config = {
  get frontendUrl() {
    return getFrontendUrl();
  },
  get backendUrl() {
    console.log('backend url : ', getBackendUrl());
    return getBackendUrl();
  }
};

export default config;
