import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginBtn = () => {
    const handleLoginSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;

        try {
            const response = await axios.post('/auth/google', { token: googleToken });
            if (response.data.success) {
                window.location.href = response.data.redirect_url;
            }
        } catch (error) {
            console.error('Error authenticating user:', error.response || error.message);
        }
    };

    const handleLoginError = () => {
        console.error('Login failed');
    };

    return (
        <GoogleOAuthProvider clientId="286853462386-8ksqu3nu5vf9agha6dt4b10b53br7ejn.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={credentialResponse => handleLoginSuccess(credentialResponse)}
                onError={handleLoginError}
                useOneTap
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginBtn;
