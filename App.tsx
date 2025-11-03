import React from 'react';
import { Role } from './types';
import { useAppContext } from './hooks/useAppContext';
import Sidebar from './components/Sidebar';
import StudentExamView from './components/StudentExamView';
import InstructorDashboard from './components/InstructorDashboard';
import StudentDashboard from './components/StudentDashboard';
import CourseDetailView from './components/CourseDetailView';
import ExamResultsView from './components/ExamResultsView';
import PreExamChecklist from './components/PreExamChecklist';
import StudentResultDetailView from './components/StudentResultDetailView';
import AdminDashboard from './components/AdminDashboard';
import LoginScreen from './components/LoginScreen';
import UserProfile from './components/UserProfile';
import LoadingOverlay from './components/common/LoadingOverlay';
import InstructorCourseView from './components/instructor/InstructorCourseView';
import LessonView from './components/student/LessonView';
import AssignmentView from './components/student/AssignmentView';
import Header from './components/Header';
import ExamBuilder from './components/instructor/ExamBuilder';

const App: React.FC = () => {
  const { 
    currentUser, 
    isLoading, 
    activeView, 
    studentView, 
    activeCourseId,
    activeExamId,
    courses,
  } = useAppContext();

  if (!currentUser) {
    return <LoginScreen />;
  }
  
  const activeCourse = courses.find(c => c.id === activeCourseId);

  const renderStudentContent = () => {      
      switch (activeView) {
          case 'DASHBOARD':
          case 'MY_COURSES':
              if (activeCourse) {
                  switch (studentView) {
                    case 'EXAM_VIEW':
                      return <StudentExamView />;
                    case 'PRE_EXAM_CHECKLIST':
                      return <PreExamChecklist course={activeCourse} />;
                    case 'EXAM_RESULTS':
                        return <ExamResultsView course={activeCourse} />;
                    case 'RESULTS_DETAIL':
                        return <StudentResultDetailView />;
                    case 'LESSON_VIEW':
                        return <LessonView />;
                    case 'ASSIGNMENT_VIEW':
                        return <AssignmentView />;
                    default:
                       return <CourseDetailView />;
                  }
              }
              return <StudentDashboard />;
          case 'PROFILE':
            return <UserProfile user={currentUser} />;
          default:
              return <StudentDashboard />;
      }
  }

  const renderInstructorContent = () => {
    if (activeExamId) {
        return <ExamBuilder />;
    }
    if (activeCourseId) {
        return <InstructorCourseView />;
    }
    return <InstructorDashboard />;
  }

  const renderContent = () => {
    switch (currentUser.role) {
      case Role.STUDENT:
        return renderStudentContent();
      case Role.INSTRUCTOR:
        return renderInstructorContent();
      case Role.ADMIN:
        return <AdminDashboard />;
      default:
        return null;
    }
  };
  
  const isExamBuilderActive = currentUser.role === Role.INSTRUCTOR && !!activeExamId;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {!isExamBuilderActive && <Sidebar />}
        <main className={`flex-1 overflow-y-auto relative ${!isExamBuilderActive && "p-6 md:p-8 lg:p-10"}`}>
          {isLoading && <LoadingOverlay />}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;