import { Session, useSession } from "@/context/useSession";
import { authFetch } from "./authFetch";
import { BACKEND_URL } from "./constants";

export async function getSession(): Promise<Session | null> {
    const res = await authFetch(`${BACKEND_URL}/auth/session`, {
        method: 'Get',
        headers: {
            'Content-Type':'application/json'
        }
    })

    if(!res.ok) {
        console.log(`failed to get session ${res.status} ${res.statusText}`);
        return null;
    }

    const result = await res.json();
    return result;
}