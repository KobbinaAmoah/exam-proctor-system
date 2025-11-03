import React, { useState, useEffect } from 'react';
import { LogoIcon } from './icons/Icons';
import { MOCK_STUDENT, MOCK_INSTRUCTOR, MOCK_ADMIN } from '../constants';
import { useAppContext } from '../hooks/useAppContext';
import { loginUser } from '../services/api';

const LoginScreen: React.FC = () => {
  const { dispatch, error } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginAttempt(email, password);
  };
  
  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123'); // Use a dummy password for demo
    handleLoginAttempt(demoEmail, 'password123');
  };

  const handleLoginAttempt = async (loginEmail: string, loginPass: string) => {
    if (!loginEmail) return;
    dispatch({ type: 'LOGIN_START' });
    try {
        const user = await loginUser(loginEmail, loginPass);
        if (user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } else {
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid credentials. Please try again.' });
        }
    } catch (err: any) {
        dispatch({ type: 'LOGIN_FAILURE', payload: err.message });
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <LogoIcon className="h-12 w-12 text-indigo-500" />
          <h1 className="ml-4 text-4xl font-bold text-gray-900 dark:text-white self-center">M-System</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
               {localError && <p className="text-red-500 text-xs italic">{localError}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
         <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p className="font-bold mb-2">For quick access, use a demo account:</p>
            <div className="flex justify-center space-x-2">
                 <button onClick={() => handleDemoLogin(MOCK_STUDENT.email!)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600">Student</button>
                 <button onClick={() => handleDemoLogin(MOCK_INSTRUCTOR.email!)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600">Instructor</button>
                 <button onClick={() => handleDemoLogin(MOCK_ADMIN.email!)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600">Admin</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
