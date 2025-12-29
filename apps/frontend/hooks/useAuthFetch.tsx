import { useContext } from "react";
import { AuthContext }  from '../context/useAuthFetch' 

export const useAuthFetch = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthFetch must be used within an AuthProvider");
  }

  return context;
};
