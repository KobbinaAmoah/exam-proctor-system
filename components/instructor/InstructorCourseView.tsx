import React, { useState } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { ArrowLeftIcon, BookOpenIcon, UsersIcon, DocumentTextIcon, BellIcon } from '../icons/Icons';
import Tabs from '../common/Tabs';
import EnrollmentManager from './EnrollmentManager';
import ContentManager from './ContentManager';
import InstructorGradebook from './InstructorGradebook';
import AnnouncementManager from './AnnouncementManager';

const InstructorCourseView: React.FC = () => {
    const { activeCourseId, courses, dispatch } = useAppContext();
    const [activeTab, setActiveTab] = useState('students');
    
    const course = courses.find(c => c.id === activeCourseId);

    const handleBack = () => {
        dispatch({ type: 'SELECT_COURSE', payload: null });
    };

    if (!course) {
        return <div className="text-center">Course not found. Select a course from the dashboard.</div>
    }

    const tabs = [
        { id: 'students', label: 'Students', icon: UsersIcon },
        { id: 'content', label: 'Content', icon: BookOpenIcon },
        { id: 'submissions', label: 'Submissions', icon: DocumentTextIcon },
        { id: 'announcements', label: 'Announcements', icon: BellIcon },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            <button onClick={handleBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to All Courses
            </button>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
                <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{course.description}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 border-b border-gray-200 dark:border-gray-700">
                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="p-6">
                   {activeTab === 'students' && <EnrollmentManager course={course} />}
                   {activeTab === 'content' && <ContentManager course={course} />}
                   {activeTab === 'submissions' && <InstructorGradebook course={course} />}
                   {activeTab === 'announcements' && <AnnouncementManager course={course} />}
                </div>
            </div>
        </div>
    );
};

export default InstructorCourseView;
