import React from 'react';
import { SearchIcon, BellIcon, QuestionMarkCircleIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import { LogoIcon } from './icons/Icons';

const Header: React.FC = () => {
    const { currentUser, dispatch } = useAppContext();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-10 flex-shrink-0">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Logo */}
                    <div className="flex items-center">
                         <LogoIcon className="h-8 w-8 text-indigo-500" />
                         <h1 className="ml-3 text-2xl font-bold hidden sm:block">M-System</h1>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="flex-1 flex justify-center px-2 lg:ml-6">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Search..."
                                    type="search"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Right side icons & User menu */}
                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                            <span className="sr-only">Help</span>
                            <QuestionMarkCircleIcon className="h-6 w-6" />
                        </button>
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" />
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>

                        {currentUser && (
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-800 dark:text-white">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
                                </div>
                                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                                <button onClick={handleLogout} className="p-1 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none" title="Logout">
                                    <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;