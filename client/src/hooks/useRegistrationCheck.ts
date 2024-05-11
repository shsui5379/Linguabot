import { useEffect } from "react";
import User from "../types/User";
import { useNavigate } from "react-router-dom";

export default function useRegistrationCheck() {
    const navigateTo = useNavigate();
    useEffect(() => {
        User.fetchUser().catch((error) => {
            if (error.message === "User doesn't exist") {
                navigateTo("/register");
            } else if (error.message === "Not authenticated") {
                window.location.href = '/signup';
            }
        });
    }, [navigateTo]);
}