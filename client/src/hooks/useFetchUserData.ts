import { useEffect, useState } from "react";
import User from "../types/User";

export default function useFetchUserData() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        User.fetchUser()
            .then((user) => setUser(user))
            .catch((error) => console.error(error.message));
    }, []);
    return [user, setUser];
}