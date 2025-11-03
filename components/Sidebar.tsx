import React from 'react';
import { Role } from '../types';
import { LogoIcon, BookOpenIcon, PresentationChartBarIcon, UserCircleIcon, CogIcon, UsersIcon, ChartBarIcon, AdjustmentsHorizontalIcon, ShieldCheckIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';

const Sidebar: React.FC = () => {
  const { currentUser, activeView, dispatch } = useAppContext();

  if (!currentUser) return null;
  
  const handleNavigate = (view: string) => {
      if (currentUser?.role === Role.INSTRUCTOR && view !== activeView) {
        // When switching main views as instructor, deselect any active course
        dispatch({ type: 'SELECT_COURSE', payload: null });
      }
      dispatch({ type: 'SET_VIEW', payload: view });
  };
  
  const getNavItems = () => {
      switch(currentUser.role) {
          case Role.STUDENT:
            return [
                { id: 'DASHBOARD', icon: PresentationChartBarIcon, label: 'Dashboard' },
                { id: 'PROFILE', icon: UserCircleIcon, label: 'Profile' },
            ];
          case Role.INSTRUCTOR:
            return [
                { id: 'courses', icon: BookOpenIcon, label: 'Courses' },
                { id: 'monitoring', icon: ShieldCheckIcon, label: 'Student Monitoring' },
                { id: 'proctoring_settings', icon: AdjustmentsHorizontalIcon, label: 'AI Proctoring Settings' },
            ];
          case Role.ADMIN:
            return [
                { id: 'stats', icon: ChartBarIcon, label: 'Statistics' },
                { id: 'users', icon: UsersIcon, label: 'User Management' },
                { id: 'settings', icon: CogIcon, label: 'System Settings' },
            ];
          default:
            return [];
      }
  }
  
  const navItems = getNavItems();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button 
                    key={item.label} 
                    onClick={() => handleNavigate(item.id)}
                    className={`group w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-left
                      ${isActive 
                        ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`
                    }
                  >
                    <item.icon className={`mr-3 h-6 w-6 ${isActive ? 'text-gray-500 dark:text-gray-300' : 'text-gray-400 dark:text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;