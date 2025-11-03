import React, { useMemo } from 'react';
import { Role } from '../types';
import { UsersIcon, BookOpenIcon, DocumentTextIcon, ShieldExclamationIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';

interface StatCardProps {
    icon: React.FC<{className?: string}>;
    title: string;
    value: string | number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);


const StatisticsView: React.FC = () => {
    const { users, courses, exams, flaggedEvents, assignments, submissions } = useAppContext();

    const userStats = useMemo(() => ({
        total: users.length,
        students: users.filter(u => u.role === Role.STUDENT).length,
        instructors: users.filter(u => u.role === Role.INSTRUCTOR).length,
        admins: users.filter(u => u.role === Role.ADMIN).length,
    }), [users]);

    const highRiskFlags = useMemo(() => flaggedEvents.filter(e => e.riskLevel === 'High').length, [flaggedEvents]);
    const totalExams = useMemo(() => Object.keys(exams).length, [exams]);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={UsersIcon} title="Total Users" value={userStats.total} color="bg-blue-500" />
                <StatCard icon={BookOpenIcon} title="Total Courses" value={courses.length} color="bg-green-500" />
                <StatCard icon={DocumentTextIcon} title="Total Exams" value={totalExams} color="bg-indigo-500" />
                <StatCard icon={DocumentTextIcon} title="Total Assignments" value={assignments.length} color="bg-purple-500" />
                <StatCard icon={DocumentTextIcon} title="Total Submissions" value={submissions.length} color="bg-pink-500" />
                <StatCard icon={ShieldExclamationIcon} title="High-Risk Flags" value={highRiskFlags} color="bg-red-500" />
            </div>

             <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">User Role Distribution</h3>
                <div className="flex justify-around items-end h-48 p-4">
                   <div className="text-center">
                       <div className="bg-blue-200 dark:bg-blue-800 rounded-t-lg" style={{ height: `${(userStats.students / userStats.total * 100) || 0}%`, width: '50px' }}></div>
                       <p className="mt-2 text-sm font-semibold">{userStats.students}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                   </div>
                   <div className="text-center">
                       <div className="bg-green-200 dark:bg-green-800 rounded-t-lg" style={{ height: `${(userStats.instructors / userStats.total * 100) || 0}%`, width: '50px' }}></div>
                       <p className="mt-2 text-sm font-semibold">{userStats.instructors}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Instructors</p>
                   </div>
                   <div className="text-center">
                       <div className="bg-indigo-200 dark:bg-indigo-800 rounded-t-lg" style={{ height: `${(userStats.admins / userStats.total * 100) || 0}%`, width: '50px' }}></div>
                       <p className="mt-2 text-sm font-semibold">{userStats.admins}</p>
                       <p className="text-xs text-gray-500 dark:text-gray-400">Admins</p>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsView;