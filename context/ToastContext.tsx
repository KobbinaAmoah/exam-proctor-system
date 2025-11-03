import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage, ToastType, ToastContextType } from '../types';
import ToastContainer from '../components/common/ToastContainer';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

// FIX: Use an interface for props to avoid potential parsing issues with inline types.
interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastContainer toasts={toasts} />
        </ToastContext.Provider>
    );
};