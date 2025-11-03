import React, { useState } from 'react';
import { User, Role, Course } from '../types';
import { PencilIcon, TrashIcon, PlusIcon, BookOpenIcon } from './icons/Icons';
import UserEditModal from './UserEditModal';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { deleteUser, saveUser, saveCourse } from '../services/api';
import ConfirmationModal from './common/ConfirmationModal';


interface EnrollModalProps {
    user: User;
    courses: Course[];
    onClose: () => void;
    onSave: (courseIds: string[]) => void;
}

const EnrollModal: React.FC<EnrollModalProps> = ({ user, courses, onClose, onSave }) => {
    const coursesUserIsEnrolledIn = courses.filter(c => c.enrolledStudentIds.includes(user.id)).map(c => c.id);
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set(coursesUserIsEnrolledIn));

    const handleToggleCourse = (courseId: string) => {
        setSelectedCourses(prev => {
            const newSet = new Set(prev);
            if (newSet.has(courseId)) {
                newSet.delete(courseId);
            } else {
                newSet.add(courseId);
            }
            return newSet;
        });
    };
    
    const handleSave = () => {
        onSave(Array.from(selectedCourses));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold">Enroll {user.name} in Courses</h3>
                </div>
                <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                    {courses.map(course => (
                        <label key={course.id} className="flex items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <input 
                                type="checkbox"
                                checked={selectedCourses.has(course.id)}
                                onChange={() => handleToggleCourse(course.id)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-3 text-gray-700 dark:text-gray-300">{course.title}</span>
                        </label>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Save Enrollment</button>
                </div>
             </div>
        </div>
    );
};

const UserManager: React.FC = () => {
    const { users, courses, dispatch } = useAppContext();
    const addToast = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setIsEditModalOpen(true);
    };
    
    const handleEnroll = (user: User) => {
        setEditingUser(user);
        setIsEnrollModalOpen(true);
    }

    const handleSaveUser = async (user: User) => {
        try {
            const savedUser = await saveUser(user);
            dispatch({ type: 'SAVE_USER_SUCCESS', payload: savedUser });
            addToast(`User '${savedUser.name}' saved successfully.`, 'success');
            setIsEditModalOpen(false);
        } catch(e: any) {
            addToast(e.message, 'error');
        }
    };
    
    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        try {
            await deleteUser(deletingUser.id);
            dispatch({ type: 'DELETE_USER_SUCCESS', payload: deletingUser.id });
            addToast(`User '${deletingUser.name}' deleted.`, 'success');
            setDeletingUser(null);
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    }
    
    const handleSaveEnrollment = async (enrolledCourseIds: string[]) => {
        if (!editingUser) return;
        
        try {
            // Update all courses at once
            const courseUpdatePromises = courses.map(course => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                const wasEnrolled = course.enrolledStudentIds.includes(editingUser.id);
                
                if (isEnrolled && !wasEnrolled) {
                    // enroll
                    const updatedCourse = {...course, enrolledStudentIds: [...course.enrolledStudentIds, editingUser.id]};
                    return saveCourse(updatedCourse);
                } else if (!isEnrolled && wasEnrolled) {
                    // unenroll
                    const updatedCourse = {...course, enrolledStudentIds: course.enrolledStudentIds.filter(id => id !== editingUser.id)};
                    return saveCourse(updatedCourse);
                }
                return Promise.resolve(course);
            });
            
            const updatedCourses = await Promise.all(courseUpdatePromises);
            
            // Dispatch updates one by one (or create a new batch action)
            updatedCourses.forEach(c => dispatch({ type: 'SAVE_COURSE_SUCCESS', payload: c }));
            
            addToast(`${editingUser.name}'s enrollment updated.`, 'success');
            setIsEnrollModalOpen(false);
            setEditingUser(null);
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };

    const roleColors: Record<Role, string> = {
        [Role.STUDENT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [Role.INSTRUCTOR]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        [Role.ADMIN]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };

    return (
      <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">User Management</h3>
                <button onClick={handleCreate} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <PlusIcon className="w-5 h-5 mr-1" />
                    Create User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColors[user.role]}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {user.role === Role.STUDENT && (
                                        <button onClick={() => handleEnroll(user)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 p-1" title="Enroll in Courses"><BookOpenIcon className="w-5 h-5"/></button>
                                    )}
                                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1" title="Edit User"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => setDeletingUser(user)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1" title="Delete User"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isEditModalOpen && (
                <UserEditModal
                    user={editingUser}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveUser}
                />
            )}
            {isEnrollModalOpen && editingUser && (
                <EnrollModal 
                    user={editingUser} 
                    courses={courses}
                    onClose={() => setIsEnrollModalOpen(false)}
                    onSave={handleSaveEnrollment}
                />
            )}
        </div>
        {deletingUser && (
            <ConfirmationModal 
                title="Delete User"
                message={`Are you sure you want to delete the user "${deletingUser.name}"? This action cannot be undone.`}
                onConfirm={handleDeleteUser}
                onCancel={() => setDeletingUser(null)}
            />
        )}
      </>
    );
};

export default UserManager;