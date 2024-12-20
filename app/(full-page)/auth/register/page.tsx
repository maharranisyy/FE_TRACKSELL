/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import Swal from 'sweetalert2';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please enter a valid email address.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        if (!password.trim()) {
            Swal.fire({
                title: 'Password Required',
                text: 'Please enter a password.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        
        if (password !== confirmPassword) {
            Swal.fire({
                title: 'Password Mismatch',
                text: 'Passwords do not match.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        if (!checked) {
            Swal.fire({
                title: 'Terms Not Accepted',
                text: 'You must agree to the Terms and Conditions.',
                icon: 'warning',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });
    
            if (response.ok) {
                Swal.fire({
                    title: 'Registration Successful!',
                    text: 'You have successfully registered.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                }).then(() => {
                    router.push('/auth/login'); // Redirect to login after success
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: 'Registration Failed',
                    text: errorData.message,
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Registration failed. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    }; 

    return (
        <div
            className={containerClassName}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                    width: '80%'  // Ensures both sides occupy equal width
                }}
            >
                {/* Left Side - Image */}
                <div
                    style={{
                        flex: 1,
                        background: 'linear-gradient(to bottom, #ffffff, #1E90FF)', // White to sea blue gradient
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="text-center" style={{ height: '100%', width: '100%' }}>
                        <img
                            src="/layout/images/leftside.png" // Replace with your image path
                            alt="Welcome Image"
                            style={{ objectFit: 'cover', height: '100%', width: '100%' }} // Ensures image covers the entire left side
                        />
                    </div>
                </div>

                {/* Right Side - Sign Up */}
                <div
                    style={{
                        flex: 1,
                        padding: '3rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}
                >
                    <h3 className="text-center text-900 text-3xl font-medium mb-5">Register</h3>
                    <div className="mb-3">
                        <label htmlFor="name" className="block text-900 text-xl font-medium mb-2">
                            Name
                        </label>
                        <InputText
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="block text-900 text-xl font-medium mb-2">
                            Password
                        </label>
                        <Password
                            inputId="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            toggleMask
                            className="w-full"
                            inputClassName="w-full p-3"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="block text-900 text-xl font-medium mb-2">
                            Confirm Password
                        </label>
                        <Password
                            inputId="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            toggleMask
                            className="w-full"
                            inputClassName="w-full p-3"
                        />
                    </div>

                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                        <div className="flex align-items-center">
                            <Checkbox
                                inputId="agreeTerms"
                                checked={checked}
                                onChange={(e) => setChecked(e.checked ?? false)}
                                className="mr-2"
                            />
                            <label htmlFor="agreeTerms">
                                I agree to the <a href="#" className="font-medium" style={{ color: 'var(--primary-color)' }}>Terms and Conditions</a>
                            </label>
                        </div>
                    </div>

                    <Button
                        label="Sign Up"
                        className="w-full p-3 text-xl"
                        style={{
                            backgroundColor: '#800000', // Maroon color
                            borderColor: '#800000', // Maroon border
                            color: '#fff', // White text
                        }}
                        onClick={handleRegister}
                    />

                    <div className="text-center mt-5">
                        <span className="text-600">Already have an account?</span>
                        <a href="/auth/login" className="font-medium" style={{ color: 'var(--primary-color)', marginLeft: '5px' }}>
                            Sign In now
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
