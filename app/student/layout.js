"use client";
import Link from 'next/link';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
    HomeOutlined,
    FileTextOutlined,
    UploadOutlined,
    SettingOutlined,
    LogoutOutlined,
    BookOutlined
} from '@ant-design/icons';
import TopHeader from '@/components/TopHeader';
import Cookies from 'js-cookie';

const Layout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();

    const getLinkClasses = (path) => {
        return pathname === path
            ? "flex items-center gap-2 p-3 border-l-2 border-gray-300 text-blue-800 bg-blue-100"
            : "flex items-center gap-2 p-3 border-l-2 border-transparent hover:border-blue-200 duration-100 text-gray-600 hover:bg-gray-100";
    };

    const handleLogout = () => {
        // Remove the token from cookies
        Cookies.remove('token');
        // Redirect to the login page or any other page
        router.push('/auth/sign-in');
    };

    return (
        <>
            <TopHeader />
            <div className="h-screen flex flex-col">
                <div className="flex flex-1">
                    <nav className="w-[260px] flex flex-col border-r border-gray-200 bg-gray-50 p-6 space-y-6 text-lg">
                        <div className="logo p-4 text-center">
                            <h1 className="text-2xl font-bold text-black">STUDENT PORTAL</h1>
                            <p className="text-xs text-black-300">RESOURCE HUB</p>
                        </div>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/student" className={getLinkClasses('/student')}>
                                    <HomeOutlined />
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/documents" className={getLinkClasses('/student/documents')}>
                                    <FileTextOutlined />
                                    My Documents
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/upload" className={getLinkClasses('/student/upload')}>
                                    <UploadOutlined />
                                    New Upload
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/preferences" className={getLinkClasses('/student/preferences')}>
                                    <BookOutlined />
                                    Preferences
                                </Link>
                            </li>
                            <li>
                                <Link href="/student/settings" className={getLinkClasses('/student/settings')}>
                                    <SettingOutlined />
                                    Settings
                                </Link>
                            </li>
                        </ul>
                        <ul className="space-y-4 mt-auto">
                            <li className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-150 flex items-center gap-2" onClick={handleLogout}>
                                <LogoutOutlined />
                                Logout
                            </li>
                        </ul>
                    </nav>
                    <main className="flex-1 overflow-auto bg-gray-50 p-6 rounded-md shadow-inner">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default Layout;
