import React from 'react';
import { QuestionType } from '../types';
import { ArrowLeftIcon, CheckCircleIcon, XIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';

const StudentResultDetailView: React.FC = () => {
  const { currentUser, activeCourseId, courses, exams, studentProgress, dispatch } = useAppContext();
  
  const course = courses.find(c => c.id === activeCourseId);
  const exam = course ? exams[course.examId] : null;
  const progress = (currentUser && course) ? studentProgress[currentUser.id]?.[course.examId] : null;
  
  const onBack = () => {
    dispatch({ type: 'SELECT_COURSE', payload: null });
  };
  
  if (!course || !exam || !progress) {
      return <div className="text-center">Exam results not available.</div>;
  }
  
  const { answers, score, gradedAnswers } = progress;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="p-8 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Results for {exam.title}</h2>
          <p className="mt-2 text-md text-gray-500 dark:text-gray-400">Course: {course.title}</p>
          <div className="mt-4 text-2xl font-bold text-indigo-600 dark:text-indigo-400 p-4 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg inline-block">
            Final Score: {score} / {exam.questions.length}
          </div>
        </div>

        <div className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Question Breakdown</h3>
          {exam.questions.map((q, index) => {
            const isCorrect = gradedAnswers?.[q.id] ?? false;
            const studentAnswer = answers[q.id];

            return (
              <div key={q.id} className={`p-4 rounded-md border ${isCorrect ? 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800'}`}>
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-800 dark:text-gray-200 flex-1">Q{index + 1}: {q.text}</p>
                    {isCorrect ? 
                        <CheckCircleIcon className="w-6 h-6 text-green-500 ml-4" /> : 
                        <XIcon className="w-6 h-6 text-red-500 ml-4" />}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 text-sm">
                  <p><span className="font-medium">Your Answer: </span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{studentAnswer || <span className="italic">Not answered</span>}</span>
                  </p>
                  {!isCorrect && q.type === QuestionType.MCQ && (
                     <p className="mt-1"><span className="font-medium">Correct Answer: </span>
                        {/* FIX: Use `correctAnswers` which is a string array, instead of non-existent `correctAnswer`. */}
                        <span className="font-mono text-green-700 dark:text-green-400">{q.correctAnswers?.join(', ')}</span>
                     </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentResultDetailView;