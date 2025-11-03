import React from 'react';

interface DashboardWidgetProps {
    title: string;
    icon: React.FC<{className?: string}>;
    children: React.ReactNode;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, icon: Icon, children }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
                <Icon className="w-6 h-6 text-indigo-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
};

export default DashboardWidget;
