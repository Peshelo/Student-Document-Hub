"use client"
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

const Layout = ({ children }) => {
    const pathname = usePathname();
    
    const getLinkClasses = (path) => {
        // alert(pathname);
        return pathname === path
            ? "p-2 border-l-2 border-blue-400 text-black"
            : "p-2 border-l-2 border-transparent hover:border-blue-200 duration-100 text-gray-600";
    };
    
    return (
        <div className="max-w-[79rem] mx-auto my-4 bg-gray-100">
            <h1 className="text-2xl text-black font-medium my-2">Student Dashboard</h1>
            <div className="flex flex-row bg-white p-4 pt-10 my-4">
                <nav className="w-[200px] border-r mr-5 border-gray-100">
                    <ul className="space-y-4 text-md">
                        <li>
                            <Link href="/student" className={getLinkClasses('/student')}>Dashboard</Link>
                        </li>
                        <li>
                            <Link href="/student/documents" className={getLinkClasses('/student/documents')}>My Documents</Link>
                        </li>
                        <li>
                            <Link href="/student/upload" className={getLinkClasses('/student/upload')}>New Upload</Link>
                        </li>
                        <li>
                            <Link href="/student/settings" className={getLinkClasses('/student/settings')}>Settings</Link>
                        </li>
                        <li className="text-sm text-gray-300">Logout</li>
                    </ul>
                </nav>
                {children}
            </div>
        </div>
    );
};

export default Layout;
