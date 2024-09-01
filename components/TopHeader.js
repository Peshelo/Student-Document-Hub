"use client"
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';

const TopHeader = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const out = () => {
    // remove token from cookie
    document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    setIsAuthenticated(false);
  }
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
    return (
        <header className="flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full bg-white border-b">
        <nav className="relative w-full md:flex md:items-center md:justify-between md:gap-3 mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <Link className="flex-none font-semibold text-xl text-black focus:outline-none focus:opacity-80" href="/" aria-label="Brand">Resource Share</Link>
      
            <div className="md:hidden">
              <button type="button" className="hs-collapse-toggle relative size-9 flex justify-center items-center text-sm font-semibold rounded-lg border border-black/50 text-black hover:bg-black/10 focus:outline-none focus:bg-black/10 disabled:opacity-50 disabled:pointer-events-none" id="hs-base-header-collapse" aria-expanded="false" aria-controls="hs-base-header" aria-label="Toggle navigation" data-hs-collapse="#hs-base-header">
                <svg className="hs-collapse-open:hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                <svg className="hs-collapse-open:block shrink-0 hidden size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                <span className="sr-only">Toggle navigation</span>
              </button>
            </div>
          </div>
      
          <div id="hs-base-header" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block" aria-labelledby="hs-base-header-collapse">
            <div className="overflow-hidden overflow-y-auto max-h-[75vh] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
              <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">  <div className="py-2 md:py-0 flex flex-col md:flex-row md:items-center md:justify-end gap-0.5 md:gap-1">
                <Link className="p-2 flex items-center text-sm text-black focus:outline-none focus:text-black" href="/" aria-current="page">
                  <svg className="shrink-0 size-4 me-3 md:me-2 block md:hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                  Home
                </Link>
      
                <Link className="p-2 flex items-center text-sm text-black/80 hover:text-black focus:outline-none focus:text-black" href="/student/upload">
                  <svg className="shrink-0 size-4 me-3 md:me-2 block md:hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Upload
                </Link>
      
                <Link className="p-2 flex items-center text-sm text-black/80 hover:text-black focus:outline-none focus:text-black" href="/tandCs">
                  <svg className="shrink-0 size-4 me-3 md:me-2 block md:hidden" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12h.01"/><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><path d="M22 13a18.15 18.15 0 0 1-20 0"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>
                  Terms and Conditions
                </Link>
      {isAuthenticated ? (
        <div classNameName="flex flex-row gap-x-2 items-center">
  <Link href="/student" className="relative flex flex-row items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-black/30 before:-translate-y-1/2">
         <Avatar>
           <AvatarFallback>FM</AvatarFallback>
           </Avatar>
       </Link>
       <LogOut onClick={()=>out()}  className="p-2 w-full flex items-center text-sm text-black/80 hover:text-black focus:outline-none focus:text-black"/>
        </div>
       
         )
        : (
          <div className="relative flex flex-wrap items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-black/30 before:-translate-y-1/2">
          <Link href="/auth/sign-in" className="p-2 w-full flex items-center text-sm text-black/80 hover:text-black focus:outline-none focus:text-black">
            <svg className="shrink-0 size-4 me-3 md:me-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Log in
          </Link>
        </div>
        )
      }
              
               
                {/* <div className="relative flex flex-wrap items-center gap-x-1.5 md:ps-2.5 mt-1 md:mt-0 md:ms-1.5 before:block before:absolute before:top-1/2 before:-start-px before:w-px before:h-4 before:bg-black/30 before:-translate-y-1/2">
                  <Link href="/auth/sign-up" className="p-2 w-full bg-black rounded-md  text-sm flex items-center text-sm text-white hover:white focus:outline-none focus:text-white">
                    Register
                  </Link>
                </div> */}
              </div>
             
              </div>
              
            </div>
          </div>
        </nav>
      </header>
    );
}

export default TopHeader;
