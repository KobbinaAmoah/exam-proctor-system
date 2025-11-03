import React, { useState } from 'react';
import { Course, Announcement } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { saveAnnouncement } from '../../services/api';
import { PlusIcon } from '../icons/Icons';
import AnnouncementCard from '../common/AnnouncementCard';

interface AnnouncementManagerProps {
    course: Course;
}

const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ course }) => {
    const { announcements, dispatch } = useAppContext();
    const addToast = useToast();

    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const courseAnnouncements = announcements.filter(a => a.courseId === course.id);

    const handleSave = async () => {
        if (!title || !content) return;
        
        const newAnnouncement: Announcement = {
            id: `ann-${Date.now()}`,
            courseId: course.id,
            title,
            content,
            createdAt: new Date(),
        };

        try {
            const saved = await saveAnnouncement(newAnnouncement);
            dispatch({ type: 'SAVE_ANNOUNCEMENT_SUCCESS', payload: saved });
            addToast('Announcement posted!', 'success');
            // Reset form
            setTitle('');
            setContent('');
            setIsCreating(false);
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Course Announcements</h3>
                {!isCreating && (
                    <button onClick={() => setIsCreating(true)} className="flex items-center px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        <PlusIcon className="w-4 h-4 mr-1" /> New Announcement
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6 space-y-3">
                    <input 
                        type="text" 
                        placeholder="Announcement Title" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" 
                    />
                    <textarea 
                        placeholder="Announcement content..." 
                        rows={4}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsCreating(false)} className="px-3 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Post</button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {courseAnnouncements.map(announcement => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                ))}
                 {courseAnnouncements.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No announcements have been posted for this course.</p>}
            </div>
        </div>
    );
};

export default AnnouncementManager;
