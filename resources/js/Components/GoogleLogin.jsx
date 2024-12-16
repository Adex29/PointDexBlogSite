import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginBtn = () => {
    const handleLoginSuccess = async (credentialResponse) => {
        const googleToken = credentialResponse.credential;

        try {

            const response = await axios.post('/api/auth/google', { token: googleToken });
            console.log('User authenticated:', response.data);
        } catch (error) {
            console.error('Error authenticating user:', error);
            console.log('Authentication failed:', error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="286853462386-8ksqu3nu5vf9agha6dt4b10b53br7ejn.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                    console.log('Login Failed');
                }}
                useOneTap
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginBtn;
