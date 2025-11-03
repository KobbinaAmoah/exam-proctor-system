import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import UpcomingDeadlinesWidget from './student/UpcomingDeadlinesWidget';
import RecentGradesWidget from './student/RecentGradesWidget';
import { BookOpenIcon, ChevronRightIcon } from './icons/Icons';

const StudentDashboard: React.FC = () => {
  const { currentUser, courses, dispatch } = useAppContext();
  
  if (!currentUser) return null;
  
  const enrolledCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));

  const handleSelectCourse = (courseId: string) => {
    dispatch({ type: 'SELECT_COURSE', payload: courseId });
  };

  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {currentUser.name}!</h2>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Here's a summary of your progress and upcoming deadlines.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <UpcomingDeadlinesWidget />
            </div>
            
            <div className="lg:col-span-1 space-y-8">
                <RecentGradesWidget />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Courses</h3>
                   <div className="space-y-3">
                      {enrolledCourses.map(course => (
                          <button 
                              key={course.id} 
                              onClick={() => handleSelectCourse(course.id)}
                              className="w-full text-left flex items-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
                          >
                              <BookOpenIcon className="w-6 h-6 text-indigo-500 mr-4" />
                              <span className="flex-grow font-medium text-gray-800 dark:text-gray-200">{course.title}</span>
                              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                          </button>
                      ))}
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default StudentDashboard;