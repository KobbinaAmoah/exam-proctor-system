import React, { useState } from 'react';
import { ArrowLeftIcon, BookOpenIcon, DocumentTextIcon, ChartBarIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import Tabs from './common/Tabs';
import LessonList from './student/LessonList';
import AssignmentList from './student/AssignmentList';
import StudentGradebook from './student/StudentGradebook';

const CourseDetailView: React.FC = () => {
  const { activeCourseId, courses, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState('lessons');

  const course = courses.find(c => c.id === activeCourseId);
  
  const handleBack = () => {
      dispatch({ type: 'SELECT_COURSE', payload: null });
  };

  if (!course) {
    return <div className="text-center">Course not found.</div>;
  }

  const tabs = [
    { id: 'lessons', label: 'Lessons', icon: BookOpenIcon },
    { id: 'assignments', label: 'Assignments', icon: DocumentTextIcon },
    { id: 'grades', label: 'Grades', icon: ChartBarIcon },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <button onClick={handleBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
          <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Instructor: {course.instructor}</p>
          <p className="mt-4 text-gray-600 dark:text-gray-300">{course.description}</p>
        </div>

        <div className="px-8 border-b border-gray-200 dark:border-gray-700">
            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="p-8">
          {activeTab === 'lessons' && <LessonList courseId={course.id} />}
          {activeTab === 'assignments' && <AssignmentList courseId={course.id} examId={course.examId} />}
          {activeTab === 'grades' && <StudentGradebook courseId={course.id} />}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;