import React from 'react';
import { BookOpenIcon, ChevronRightIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';

interface LessonListProps {
  courseId: string;
}

const LessonList: React.FC<LessonListProps> = ({ courseId }) => {
  const { lessons, dispatch } = useAppContext();
  const courseLessons = lessons.filter(l => l.courseId === courseId);
  
  const handleSelectLesson = (lessonId: string) => {
    // In a more complex app, you might store the selected lesson ID in the context state
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'LESSON_VIEW' });
  };

  return (
    <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Course Lessons</h3>
        <div className="space-y-3">
            {courseLessons.map(lesson => (
                 <button 
                    key={lesson.id} 
                    onClick={() => handleSelectLesson(lesson.id)}
                    className="w-full text-left flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                    <BookOpenIcon className="w-6 h-6 text-indigo-500 mr-4" />
                    <span className="flex-grow font-medium text-gray-800 dark:text-gray-200">{lesson.title}</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </button>
            ))}
            {courseLessons.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lessons have been added to this course yet.</p>}
        </div>
    </div>
  );
};

export default LessonList;
