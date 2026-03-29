import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password, phone, 'customer');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleError = (error) => {
        console.error('Google Signup Error Details:', error);
        setError('Google signup failed. This is often caused by browser "Shields". Please check your address bar or try again.');
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // If the hook provides an access_token, we use it. 
                await googleLogin(tokenResponse.access_token);
                navigate('/');
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
                        Create an account
                    </h2>
                    <p className="mt-2 text-center text-sm text-[#213C51]">
                        Or{' '}
                        <Link to="/login" className="font-medium text-[#213C51] bg-[#213C51]/5 border-[#213C51]/20 hover:bg-[#213C51] hover:text-white transition">
                            sign in to your existing account
                        </Link>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-[#213C51] rounded-xl focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm bg-gray-50 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#213C51] hover:bg-[#39465D] focus:ring-[#213C51] shadow-[#213C51]/30 focus:ring-offset-2 focus:ring-orange-500 shadow-md shadow-orange-600/30 transition-all font-inter">
                            Register
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
                            <span>Sign up with Google</span>
                        </button>
                        <p className="mt-3 text-[10px] text-gray-400 font-medium text-center italic">
                            Fast & secure account creation
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
