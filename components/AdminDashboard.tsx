import React from 'react';
import { CogIcon } from './icons/Icons';
import StatisticsView from './StatisticsView';
import UserManager from './UserManager';
import { useAppContext } from '../hooks/useAppContext';

const AdminDashboard: React.FC = () => {
  const { activeView } = useAppContext();

  const getPageTitle = () => {
    switch (activeView) {
      case 'stats':
        return 'Platform Statistics';
      case 'users':
        return 'User Management';
      case 'settings':
        return 'System Settings';
      default:
        return 'Dashboard';
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin: <span className="text-indigo-500">{getPageTitle()}</span></h2>
      </div>

      <div className="mt-8">
        {activeView === 'stats' && <StatisticsView />}
        {activeView === 'users' && <UserManager />}
        {activeView === 'settings' && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <CogIcon className="w-16 h-16 text-gray-400 mx-auto" />
                <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">System settings management coming soon.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">This section will contain global configurations for the platform.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
