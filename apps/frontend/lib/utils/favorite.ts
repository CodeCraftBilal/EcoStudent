import { authFetch } from "../authFetch";
import { BACKEND_URL } from "../constants";

type AddToFavorite = {
  error: boolean;
  message: string;
  alreadyInFavorite?: boolean;
};

export const addToFavorite = async (itemId: string): Promise<AddToFavorite> => {
  const res = await authFetch(`${BACKEND_URL}/favorite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId: Number(itemId),
    }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      return {
        error: true,
        message: "Sign in to add to favorites",
      };
    } else {
      return {
        error: true,
        message: "Item not added to favorites",
      };
    }
  }

  const result = await res.json();
  return result;
};

export const removeFromFavorite = async (
  itemId: string
): Promise<AddToFavorite> => {
  const res = await authFetch(`${BACKEND_URL}/favorite/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return {
        error: true,
        message: "Sign in to remove from favorites",
      };
    } else {
      return {
        error: true,
        message: "Item not found in favorites",
      };
    }
  }

  const result = await res.json();
  return result;
};
