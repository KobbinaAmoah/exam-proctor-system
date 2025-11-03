import React, { useState, useEffect } from 'react';
import { Assignment } from '../../types';
import { XIcon, SaveIcon } from '../icons/Icons';

interface AssignmentEditModalProps {
    assignment: Assignment | null;
    courseId: string;
    onClose: () => void;
    onSave: (assignment: Assignment) => void;
}

const AssignmentEditModal: React.FC<AssignmentEditModalProps> = ({ assignment, courseId, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title);
            setDescription(assignment.description);
            setDueDate(assignment.dueDate.toISOString().split('T')[0]); // Format for date input
        } else {
            setDueDate(new Date().toISOString().split('T')[0]);
        }
    }, [assignment]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newAssignment: Assignment = {
            id: assignment?.id || `assignment-${Date.now()}`,
            courseId,
            title,
            description,
            dueDate: new Date(dueDate),
        };
        onSave(newAssignment);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-xl font-bold">{assignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={5} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                            <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600">Cancel</button>
                        <button type="submit" className="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
                            <SaveIcon className="w-5 h-5 mr-2" />
                            Save Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignmentEditModal;
