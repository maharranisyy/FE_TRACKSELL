/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useContext, useState } from 'react';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import Link from 'next/link';
import Swal from 'sweetalert2';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;

                // Store the token in localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('user', JSON.stringify(user));
                }

                Swal.fire({
                    title: 'Login Success!',
                    text: 'You have successfully logged in.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    router.push('/'); // Redirect to dashboard or desired page
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Swal.fire({
                    title: 'Login Failed',
                    text: error.response?.data.message || 'An error occurred during login.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'An unexpected error occurred.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        }        
    };

    return (
        <div
            className={containerClassName}
            style={{
                backgroundColor: '#F2F3F7',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                    maxWidth: '900px',
                    overflow: 'hidden',
                    width: '100%',
                }}
            >
                {/* Left Side - Sign In */}
                <div
                    style={{
                        flex: 1,
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <div className="text-center mb-4">
                        <div className="text-900 text-3xl font-medium mb-3">
                            Sign in
                        </div>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div>
                            <label
                                htmlFor="email1"
                                className="block text-900 text-xl font-medium mb-2"
                            >
                                Email
                            </label>
                            <InputText
                                id="email1"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />

                            <label
                                htmlFor="password1"
                                className="block text-900 font-medium text-xl mb-2"
                            >
                                Password
                            </label>
                            <Password
                                inputId="password1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                            />

                            <div className="flex align-items-center justify-content-between mb-5">
                                <Link href="/auth/forgot-password" className="font-medium no-underline text-right cursor-pointer" style={{ color: '#000' }}>
                                    Lupa kata sandi anda?
                                </Link>
                            </div>
                            <Button
                                label="Sign In"
                                className="w-full p-3 text-xl"
                                style={{
                                    backgroundColor: '#800000', // Maroon color
                                    borderColor: '#800000', // Maroon border
                                    color: '#fff', // White text
                                }}
                                type="submit" // Change to type submit to trigger form submission
                            />
                        </div>
                    </form>

                    {/* "Not a member? SignUp now" text */}
                    <div className="text-center mt-5">
                        <span className="text-600">Not a member? </span>
                        <Link href="/auth/register" className="font-medium no-underline" style={{ color: 'var(--primary-color)' }}>
                            SignUp now
                        </Link>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div
                    style={{
                        flex: 1,
                        background: 'linear-gradient(to bottom, #ffffff, #1E90FF)', // White to sea blue gradient
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0',
                        height: '100%',
                    }}
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <img
                            src="/layout/images/leftside.png"
                            alt="Welcome Image"
                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
