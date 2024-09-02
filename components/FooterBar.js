import React from 'react';
import Link from 'next/link';

const FooterBar = () => {
    return (
        <footer className="mt-auto bg-gray-100 w-full dark:bg-gray-800">
            <div className="w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    <div className="col-span-full lg:col-span-1">
                        <Link href="/" aria-label="Brand">
                            <p className="flex-none text-xl font-semibold text-gray-900 dark:text-white focus:outline-none focus:opacity-80">StudentShare</p>
                        </Link>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-semibold text-gray-500">Explore</h4>
                        <div className="mt-3 grid space-y-3">
                            <p>
                                <Link href="/student/documents">
                                    <label className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">Documents</label>
                                </Link>
                            </p>
                            <p>
                                <Link href="/auth/sign-up">
                                    <label className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">Sign Up</label>
                                </Link>
                            </p>
                            <p>
                                <Link href="/auth/sign-in">
                                    <label className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">Sign In</label>
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <h4 className="font-semibold text-gray-500">Support</h4>
                        <div className="mt-3 grid space-y-3">
                            <p>
                                <Link href="/tandCs">
                                    <label className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">Terms & Conditions</label>
                                </Link>
                            </p>
                            <p>
                                <Link href="#">
                                    <label className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300">Contact Us</label>
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <h4 className="font-semibold text-gray-500">Stay Informed</h4>
                        <form>
                            <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:gap-3 bg-white rounded-lg p-2 dark:bg-gray-700">
                                <div className="w-full">
                                    <label htmlFor="email-input" className="sr-only">Subscribe</label>
                                    <input type="email" id="email-input" name="email" className="py-3 px-4 block w-full border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-600 dark:border-transparent dark:text-white dark:placeholder-gray-400" placeholder="Enter your email" />
                                </div>
                                <button type="submit" className="w-full sm:w-auto whitespace-nowrap p-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                                    Subscribe
                                </button>
                            </div>
                            <p className="mt-3 text-sm text-gray-900 dark:text-white">
                                Get updates on new resources. No spam.
                            </p>
                        </form>
                    </div>
                </div>

                <div className="mt-5 sm:mt-12 flex justify-between items-center">
                    <p className="text-sm text-gray-900 dark:text-gray-400">© 2024 StudentShare. All rights reserved.</p>
                    <div className="flex space-x-3">
                        {/* Add social media links or other icons here if needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterBar;
