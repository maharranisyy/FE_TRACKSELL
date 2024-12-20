import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);

    // Refs
    const menubuttonRef = useRef<HTMLButtonElement>(null);
    const topbarmenuRef = useRef<HTMLDivElement>(null);
    const topbarmenubuttonRef = useRef<HTMLButtonElement>(null);

    // States
    const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const toggleProfileDropdown = () => {
        setProfileDropdownVisible((prevState) => !prevState);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        console.log('User logged out');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (topbarmenuRef.current && !topbarmenuRef.current.contains(event.target as Node)) {
                setProfileDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="layout-topbar">
            {/* Logo */}
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo.jpeg`} width="47.22px" height="35px" alt="logo" />
                <span style={{ color: '0xFFFF4444' }}>TRACK SELL</span>
            </Link>

            {/* Menu Toggle Button */}
            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            {/* Sidebar Toggle Button */}
            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            {/* Topbar Menu */}
            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible,
                })}
            >
                {/* Calendar Button */}
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>

                {/* Profile Dropdown */}
                <div className="profile-dropdown-container">
                    <button
                        type="button"
                        className="p-link layout-topbar-button"
                        onClick={toggleProfileDropdown}
                    >
                        <i className="pi pi-user"></i>
                        <span>{isLoggedIn ? 'Profile' : 'Login/Register'}</span>
                    </button>
                    {profileDropdownVisible && (
                        <div className="profile-dropdown">
                            {isLoggedIn ? (
                                <>
                                    <Link href="/profile">
                                        <button type="button" className="p-link dropdown-item">
                                            Profile
                                        </button>
                                    </Link>
                                    <button
                                        type="button"
                                        className="p-link dropdown-item"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login">
                                        <button type="button" className="p-link dropdown-item">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/auth/register">
                                        <button type="button" className="p-link dropdown-item">
                                            Register
                                        </button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Settings Button */}
                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-cog"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
