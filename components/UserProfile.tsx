import React from 'react';
import { User } from '../types';
import { UserCircleIcon, PencilIcon } from './icons/Icons';

interface UserProfileProps {
    user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center md:flex-row md:items-start">
                <UserCircleIcon className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <p className="text-md text-gray-500 dark:text-gray-400">{user.email}</p>
                    <span className="mt-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {user.role}
                    </span>
                </div>
                <button className="mt-4 md:mt-0 md:ml-auto flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400" disabled>
                    <PencilIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                </button>
            </div>
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Account Details</h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">This section is under construction. Future updates will allow you to change your password and manage notification settings.</p>
            </div>
        </div>
    );
};

export default UserProfile;
