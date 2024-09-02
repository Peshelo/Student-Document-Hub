"use client";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    MenuOutlined,
    UserOutlined,
    DesktopOutlined,
    SafetyCertificateOutlined,
    CheckCircleOutlined,
    FileOutlined,
    TeamOutlined,
} from '@ant-design/icons';

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter(); // Use Next.js router for navigation
    const currentPath = pathname.split('/')[2] || ''; // Get the current path to highlight active link

    // Function to check for token and handle redirection if token is not present
    useEffect(() => {
        const token = Cookies.get('token'); // Get token from cookies
        if (!token) {
            router.push('/auth/sign-in'); // Redirect to sign page if no token found
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token'); // Remove token from cookies
        router.push('/auth/sign-in'); // Redirect to login page
    };

    const getLinkClasses = (path) => {
        return currentPath === path
            ? "flex items-center gap-2 p-3 bg-blue-50 border-l-4 border-blue-500 text-blue-700 font-semibold rounded-md"
            : "flex items-center gap-2 p-3 hover:bg-blue-50 hover:border-l-4 hover:border-blue-300 text-gray-600 rounded-md transition-colors duration-200";
    };

    const items = [
        { label: 'Dashboard', path: '', icon: <CheckCircleOutlined /> },
        { label: 'All Categories', path: 'categories', icon: <DesktopOutlined /> },
        { label: 'All Documents', path: 'documents', icon: <FileOutlined /> },
        { label: 'All Students', path: 'students', icon: <TeamOutlined /> },
        { label: 'Settings', path: 'settings', icon: <SafetyCertificateOutlined /> },
    ];

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <header className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-600 hover:text-black focus:outline-none"
                >
                    <MenuOutlined style={{ fontSize: '24px' }} />
                </button>
                <div className="text-lg font-bold text-gray-800">Admin Dashboard</div>
                <button className="text-gray-600 hover:text-black focus:outline-none">
                    <UserOutlined style={{ fontSize: '24px' }} />
                </button>
            </header>
            <div className="flex flex-1">
                <nav
                    className={`flex flex-col ${
                        collapsed ? 'w-20' : 'w-60'
                    } transition-all duration-300 bg-white shadow-lg border-r overflow-y-auto`}
                    style={{
                        minHeight: '100vh',
                        backgroundColor: '#001529',
                        color: 'white',
                    }}
                >
                    <div className="logo p-4 text-center">
                        <h1 className="text-2xl font-bold text-white">Academic</h1>
                        <p className="text-xs text-gray-300">RESOURCE HUB</p>
                    </div>
                    <ul className="space-y-1 p-4 flex-1">
                        {items.map(({ label, path, icon }) => (
                            <li key={path}>
                                <Link href={`/admin/${path}`}>
                                    <label className={getLinkClasses(path)}>
                                        {icon}
                                        {!collapsed && <span>{label}</span>}
                                    </label>
                                </Link>
                            </li>
                        ))}
                          <li> 
                              <button
                        className="text-sm text-gray-300 bg-gray-500 hover:bg-blue-600 text-white py-2 px-4 w-full rounded-md transition-colors duration-200 mt-auto mb-4 my-10"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    </li>
                    </ul>
               
                </nav>
                <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
