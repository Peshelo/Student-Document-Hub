"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { getCookie } from '@/lib/utils';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useRouter();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const validateForm = () => {
    if (!email) {
      setError('Please include an email address.');
      return false;
    }
    if (password.length < 2) {
      setError('Password must be at least 2 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      const response = await fetch('http://ec2-13-60-59-168.eu-north-1.compute.amazonaws.com:8078/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });
      console.log(response.status);
      if (response.status == 200) {
        // save token to cookie with expiry of 1 day
        const data = await response.json();
        document.cookie = `token=${data.access_token};max-age=86400;path=/`;
        document.cookie = `username=${email};max-age=86400;path=/`;

        // Get stored cookie
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
        const username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*=\s*([^;]*).*$)|^.*$/, '$1');

        console.log(username);
        
        navigate.push('/');
      } else if (response.status == 422) {
        navigate.push('/auth/set-password');
      } else {
        const data = await response.json();
        setError(data.message || 'An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="w-screen top-0 z-10 h-5/6 p-10 backdrop-blur-md backdrop-brightness-50 justify-center items-center">
      <div className="mt-7 w-[500px] h-fit bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-neutral-900 dark:border-neutral-700">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              Dont have an account yet?
              <a className="text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="/auth/sign-up">
                Sign up here
              </a>
            </p>
          </div>

          <div className="mt-5">
            <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:mr-6 after:flex-1 after:border-t after:border-gray-200 after:ml-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
              Or
            </div>

            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={email}
                      onChange={handleEmailChange}
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                    <a className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500" href="/recover-account">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      required
                      aria-describedby="password-error"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="remember-me" className="text-sm dark:text-white">Remember me</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
