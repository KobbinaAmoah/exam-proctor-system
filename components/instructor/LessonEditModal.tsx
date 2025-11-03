import React, { useState, useEffect } from 'react';
import { Lesson } from '../../types';
import { XIcon, SaveIcon } from '../icons/Icons';

interface LessonEditModalProps {
    lesson: Lesson | null;
    courseId: string;
    onClose: () => void;
    onSave: (lesson: Lesson) => void;
}

const LessonEditModal: React.FC<LessonEditModalProps> = ({ lesson, courseId, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<'text' | 'video'>('text');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        if (lesson) {
            setTitle(lesson.title);
            setType(lesson.type);
            setContent(lesson.content);
            setVideoUrl(lesson.videoUrl || '');
        }
    }, [lesson]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newLesson: Lesson = {
            id: lesson?.id || `lesson-${Date.now()}`,
            courseId,
            title,
            type,
            content: type === 'text' ? content : content,
            videoUrl: type === 'video' ? videoUrl : undefined,
        };
        onSave(newLesson);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold">{lesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lesson Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content Type</label>
                            <select id="type" value={type} onChange={e => setType(e.target.value as 'text' | 'video')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                            </select>
                        </div>
                        {type === 'text' ? (
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                                <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={8} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        ) : (
                             <div>
                                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">YouTube Embed URL</label>
                                <input type="url" id="videoUrl" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required placeholder="e.g., https://www.youtube.com/embed/VIDEO_ID" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">Description</label>
                                <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500">Cancel</button>
                        <button type="submit" className="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
                            <SaveIcon className="w-5 h-5 mr-2" />
                            Save Lesson
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LessonEditModal;
