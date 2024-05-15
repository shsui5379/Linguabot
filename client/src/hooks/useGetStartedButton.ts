import User from "../types/User";


export default async function handleGetStartedCheck() {
    try {
        const user = await User.fetchUser();
        if (user) {
            window.location.href = '/chat'; 
        } else {
            window.location.href = '/signup';
        }
    } catch (error) {
        if (error.message === 'Not authenticated') {
            window.location.href = '/signup';
        } else if(error.message === "User doesn't exist") {
            window.location.href = '/register';
        }else {
            console.error('Error:', error);
        }
    }
}