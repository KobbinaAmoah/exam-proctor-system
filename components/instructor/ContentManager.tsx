import React, { useState } from 'react';
import { Course, Lesson, Assignment } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { PlusIcon, PencilIcon, TrashIcon, BookOpenIcon, DocumentTextIcon } from '../icons/Icons';
import { saveLesson, deleteLesson, saveAssignment, deleteAssignment } from '../../services/api';
import ConfirmationModal from '../common/ConfirmationModal';
import LessonEditModal from './LessonEditModal';
import AssignmentEditModal from './AssignmentEditModal';

interface ContentManagerProps {
    course: Course;
}

const ContentManager: React.FC<ContentManagerProps> = ({ course }) => {
    const { lessons, assignments, exams, dispatch } = useAppContext();
    const addToast = useToast();

    const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
    const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    
    const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
    const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    const courseLessons = lessons.filter(l => l.courseId === course.id);
    const courseAssignments = assignments.filter(a => a.courseId === course.id);
    const courseExam = exams[course.examId];

    // Lesson Handlers
    const handleSaveLesson = async (lesson: Lesson) => {
        try {
            const saved = await saveLesson(lesson);
            dispatch({ type: 'SAVE_LESSON_SUCCESS', payload: saved });
            addToast('Lesson saved!', 'success');
            setIsLessonModalOpen(false);
        } catch (e: any) { addToast(e.message, 'error'); }
    };
    const handleDeleteLesson = async () => {
        if (!deletingLesson) return;
        try {
            await deleteLesson(deletingLesson.id);
            dispatch({ type: 'DELETE_LESSON_SUCCESS', payload: deletingLesson.id });
            addToast('Lesson deleted.', 'info');
            setDeletingLesson(null);
        } catch (e: any) { addToast(e.message, 'error'); }
    };

    // Assignment Handlers
    const handleSaveAssignment = async (assignment: Assignment) => {
        try {
            const saved = await saveAssignment(assignment);
            dispatch({ type: 'SAVE_ASSIGNMENT_SUCCESS', payload: saved });
            addToast('Assignment saved!', 'success');
            setIsAssignmentModalOpen(false);
        } catch (e: any) { addToast(e.message, 'error'); }
    };
    const handleDeleteAssignment = async () => {
        if (!deletingAssignment) return;
        try {
            await deleteAssignment(deletingAssignment.id);
            dispatch({ type: 'DELETE_ASSIGNMENT_SUCCESS', payload: deletingAssignment.id });
            addToast('Assignment deleted.', 'info');
            setDeletingAssignment(null);
        } catch (e: any) { addToast(e.message, 'error'); }
    };
    
    const handleEditExam = () => {
        dispatch({ type: 'EDIT_EXAM', payload: course.examId });
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lessons Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center"><BookOpenIcon className="w-6 h-6 mr-2" /> Lessons</h3>
                        <button onClick={() => { setEditingLesson(null); setIsLessonModalOpen(true); }} className="flex items-center px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Lesson
                        </button>
                    </div>
                    <div className="space-y-2">
                        {courseLessons.map(lesson => (
                            <div key={lesson.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <p className="flex-grow font-medium">{lesson.title}</p>
                                <button onClick={() => {setEditingLesson(lesson); setIsLessonModalOpen(true);}} className="p-1 text-indigo-600 hover:text-indigo-800"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => setDeletingLesson(lesson)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assignments & Exam Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center"><DocumentTextIcon className="w-6 h-6 mr-2" /> Graded Items</h3>
                        <button onClick={() => { setEditingAssignment(null); setIsAssignmentModalOpen(true); }} className="flex items-center px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                           <PlusIcon className="w-4 h-4 mr-1" /> Add Assignment
                        </button>
                    </div>
                     <div className="space-y-2">
                        {courseAssignments.map(assignment => (
                             <div key={assignment.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                <p className="flex-grow font-medium">{assignment.title}</p>
                                <button onClick={() => {setEditingAssignment(assignment); setIsAssignmentModalOpen(true);}} className="p-1 text-indigo-600 hover:text-indigo-800"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => setDeletingAssignment(assignment)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                         {courseExam && (
                            <div className="flex items-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-md border-l-4 border-indigo-500">
                                <p className="flex-grow font-bold text-indigo-800 dark:text-indigo-200">{courseExam.title}</p>
                                <button onClick={handleEditExam} className="flex items-center px-3 py-1 text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    <PencilIcon className="w-4 h-4 mr-1" /> Edit Exam
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isLessonModalOpen && <LessonEditModal lesson={editingLesson} courseId={course.id} onClose={() => setIsLessonModalOpen(false)} onSave={handleSaveLesson} />}
            {deletingLesson && <ConfirmationModal title="Delete Lesson" message={`Are you sure you want to delete "${deletingLesson.title}"?`} onConfirm={handleDeleteLesson} onCancel={() => setDeletingLesson(null)} />}
            
            {isAssignmentModalOpen && <AssignmentEditModal assignment={editingAssignment} courseId={course.id} onClose={() => setIsAssignmentModalOpen(false)} onSave={handleSaveAssignment} />}
            {deletingAssignment && <ConfirmationModal title="Delete Assignment" message={`Are you sure you want to delete "${deletingAssignment.title}"?`} onConfirm={handleDeleteAssignment} onCancel={() => setDeletingAssignment(null)} />}
        </>
    );
};

export default ContentManager;