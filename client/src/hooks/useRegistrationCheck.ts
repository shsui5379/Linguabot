import User from "../types/User";


export default async function useRegistrationCheck() {
    try {
        const user = await User.fetchUser();
        if (!user) {
            window.location.href = '/signup';
        }
    } catch (error) {
        if (error.message === 'Not authenticated') {
            window.location.href = '/signup';
        } else {
            console.error('Error:', error);
        }
    }
}
