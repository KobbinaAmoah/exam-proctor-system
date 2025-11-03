import React from 'react';
import { Announcement } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface AnnouncementCardProps {
    announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
    const { courses } = useAppContext();
    const course = courses.find(c => c.id === announcement.courseId);

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-indigo-500">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{course?.title || 'General'}</p>
            <h4 className="font-bold text-gray-900 dark:text-white mt-1">{announcement.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{announcement.content}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">{announcement.createdAt.toLocaleDateString()}</p>
        </div>
    );
};

export default AnnouncementCard;
