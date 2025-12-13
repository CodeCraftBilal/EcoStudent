import { authFetch } from "../authFetch"
import { BACKEND_URL } from "../types/constants"

type AddToFavorite = {
    error: boolean,
    message: string,
    alreadyInFavorite?: boolean
}

export const addToFavorite = async (itemId: string): Promise<AddToFavorite> => {
    const res = await authFetch(`${BACKEND_URL}/favorite`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productId: Number(itemId),
        })
    })

    if(!res.ok) {
        return {
            error: true,
            message: 'Item not added to favorites'
        };
    }

    const result = await res.json();
    return result;
}

export const removeFromFavorite = async (itemId: string): Promise<AddToFavorite> => {
    const res = await authFetch(`${BACKEND_URL}/favorite/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if(!res.ok) {
        return {
            error: true,
            message: 'Item can\'t removed'
        };
    }

    const result = await res.json();
    return result;
}