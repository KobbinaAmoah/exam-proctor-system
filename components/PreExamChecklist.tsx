import React from 'react';
import { Course, ExamStatus } from '../types';
import { ShieldCheckIcon, CameraIcon, DesktopComputerIcon, BanIcon, ExternalLinkIcon, ArrowLeftIcon, CheckCircleIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { saveStudentProgress } from '../services/api';

interface PreExamChecklistProps {
  course: Course;
}

const PreExamChecklist: React.FC<PreExamChecklistProps> = ({ course }) => {
  const { currentUser, dispatch } = useAppContext();
  const addToast = useToast();

  const checklistItems = [
    { icon: CameraIcon, text: 'Your camera and microphone must remain on.' },
    { icon: DesktopComputerIcon, text: 'The exam must be taken in full-screen mode.' },
    { icon: ExternalLinkIcon, text: 'You must not switch tabs or minimize the browser.' },
    { icon: BanIcon, text: 'Right-clicking and copy/paste are disabled.' },
  ];
  
  const handleStart = () => {
    document.documentElement.requestFullscreen().then(() => {
        beginSecureExam();
    }).catch(err => {
        addToast(`Could not enter full-screen. Please enable it manually.`, 'info');
        beginSecureExam();
    });
  };
  
  const beginSecureExam = async () => {
    if (!currentUser) return;

    const progress = {
        status: ExamStatus.IN_PROGRESS,
        answers: {},
        gradedAnswers: {},
        startTime: new Date(),
    };

    try {
        await saveStudentProgress(currentUser.id, course.examId, progress);
        dispatch({ type: 'UPDATE_STUDENT_PROGRESS', payload: { studentId: currentUser.id, examId: course.examId, progress }});
        dispatch({ type: 'SET_STUDENT_VIEW', payload: 'EXAM_VIEW' });
    } catch(e: any) {
        addToast(e.message, 'error');
    }
  };
  
  const onBack = () => {
      dispatch({ type: 'SET_STUDENT_VIEW', payload: 'COURSE_DETAIL' });
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Course
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center">
            <ShieldCheckIcon className="w-16 h-16 text-indigo-500 mx-auto" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Exam Security Checklist</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              You are about to begin the exam for <span className="font-semibold text-indigo-500">{course.title}</span>.
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-500">
                To ensure academic integrity, please review and agree to the following rules.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            {checklistItems.map((item, index) => (
              <div key={index} className="flex items-start p-4 rounded-md bg-gray-100 dark:bg-gray-700">
                <item.icon className="w-6 h-6 mr-4 text-indigo-500 flex-shrink-0 mt-1" />
                <p className="text-gray-800 dark:text-gray-200">{item.text}</p>
              </div>
            ))}
          </div>
          
           <div className="mt-8 text-center p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Any violation of these rules will be flagged and reported to your instructor for review.
                </p>
           </div>
        </div>
        
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button 
                onClick={handleStart}
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
                <CheckCircleIcon className="w-6 h-6 mr-3" />
                I Understand, Begin Exam
            </button>
        </div>
      </div>
    </div>
  );
};

export default PreExamChecklist;