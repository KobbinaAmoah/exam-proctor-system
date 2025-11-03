import React from 'react';
import { ToastMessage } from '../../types';
import { CheckCircleIcon, XIcon, ExclamationIcon } from '../icons/Icons';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    const baseClasses = 'flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800';
    
    const icons = {
        success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
        error: <XIcon className="w-5 h-5 text-red-500" />,
        info: <ExclamationIcon className="w-5 h-5 text-blue-500" />,
    };

    const iconContainerClasses = {
        success: 'bg-green-100 dark:bg-green-800',
        error: 'bg-red-100 dark:bg-red-800',
        info: 'bg-blue-100 dark:bg-blue-800',
    }

    return (
        <div className={baseClasses} role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${iconContainerClasses[type]}`}>
                {icons[type]}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
        </div>
    );
};


interface ToastContainerProps {
    toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
    return (
        <div className="fixed top-5 right-5 z-50 space-y-2">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
};

export default ToastContainer;
