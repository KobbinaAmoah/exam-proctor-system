import React from 'react';
import { Role } from '../types';
import ProctoringSettingsComponent from './ProctoringSettings';
import StudentMonitoring from './instructor/StudentMonitoring';
import { useAppContext } from '../hooks/useAppContext';
import { BookOpenIcon, ArrowRightIcon } from './icons/Icons';

const InstructorDashboard: React.FC = () => {
  const { currentUser, courses, activeView, dispatch } = useAppContext();
  
  if (!currentUser) return null;

  const instructorCourses = courses.filter(c => c.instructor === currentUser.name);

  const getPageTitle = () => {
    switch (activeView) {
      case 'courses':
        return 'My Courses';
      case 'monitoring':
        return 'Student Monitoring';
      case 'proctoring_settings':
        return 'AI Proctoring Settings';
      default:
        return 'Dashboard';
    }
  }
  
  const handleCourseSelect = (courseId: string) => {
      dispatch({ type: 'SELECT_COURSE', payload: courseId });
  };
  
  const renderCourseManagement = () => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map(course => (
                 <div key={course.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300`}>
                    <div className="p-6 flex flex-col h-full">
                        <div className="flex items-center mb-4">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 mr-4">
                                <BookOpenIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{course.enrolledStudentIds.length} students</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 h-12 flex-grow">{course.description}</p>

                        <button 
                            onClick={() => handleCourseSelect(course.id)}
                            className="w-full flex items-center justify-center mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                           Manage Course
                           <ArrowRightIcon className="w-5 h-5 ml-2" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard: <span className="text-indigo-500">{getPageTitle()}</span></h2>
      </div>
      
      <div className="mt-8">
        {activeView === 'monitoring' && <StudentMonitoring />}
        {activeView === 'courses' && renderCourseManagement()}
        {activeView === 'proctoring_settings' && <ProctoringSettingsComponent />}
      </div>
    </div>
  );
};

export default InstructorDashboard;