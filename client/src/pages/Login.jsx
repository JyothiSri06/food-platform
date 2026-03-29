import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const { settings } = useSettings();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [googleLoaded, setGoogleLoaded] = useState(true);

    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = new URLSearchParams(location.search).get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(identifier, password);
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleError = (error) => {
        console.error('Google Login Error Details:', error);
        setError('Google login failed. This is often caused by browser "Shields". Please check your address bar or try again.');
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // If the hook provides an access_token, we use it. 
                // Note: Updating backend to support this if it's not an idToken.
                await googleLogin(tokenResponse.access_token);
                navigate(redirect);
            } catch (err) {
                setError(err.response?.data?.message || 'Google verification failed');
            }
        },
        onError: handleGoogleError,
    });

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#E8E2D8]/60 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/20">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-[#213C51] tracking-tight">
                        Sign in to {settings.business_name || 'Jeji Vantalu'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#213C51]">
                        New to {settings.business_name || 'Jeji Vantalu'}?{' '}
                        <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 transition-colors">
                            Create an account
                        </Link>
                    </p>
                    <p className="mt-2 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-60">
                        Mock Admin: admin@jejivantalu.com | admin123
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email or Phone Number</label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                                placeholder="Email or Phone Number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                                placeholder="Password"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-[#213C51]/60 hover:text-orange-600 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-[#213C51] bg-[#213C51]/5 border-[#213C51]/20 hover:bg-[#213C51] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md shadow-orange-600/30 transition-all font-inter"
                        >
                            Sign in
                        </button>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300/30"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                            <span className="px-3 py-1 bg-[#E8E2D8] text-gray-400 rounded-full border border-gray-300/20">or</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            type="button"
                            onClick={() => loginWithGoogle()}
                            className="flex items-center justify-center space-x-3 w-[280px] py-3 px-4 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 transition-all font-medium text-gray-700"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                            <span>Sign in with Google</span>
                        </button>
                        <p className="mt-3 text-[10px] text-gray-400 font-medium text-center italic">
                            Industry-standard secure login
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
