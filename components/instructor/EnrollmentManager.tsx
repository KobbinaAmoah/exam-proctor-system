import React from 'react';
import { Course } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { UserCircleIcon } from '../icons/Icons';

interface EnrollmentManagerProps {
    course: Course;
}

const EnrollmentManager: React.FC<EnrollmentManagerProps> = ({ course }) => {
    const { users } = useAppContext();

    const enrolledStudents = users.filter(u => course.enrolledStudentIds.includes(u.id));

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Enrolled Students ({enrolledStudents.length})</h3>
            <div className="space-y-3">
                {enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <UserCircleIcon className="w-8 h-8 text-gray-400 mr-4" />
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                        </div>
                    </div>
                ))}
                 {enrolledStudents.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No students are currently enrolled in this course.</p>
                 )}
            </div>
        </div>
    );
};

export default EnrollmentManager;
