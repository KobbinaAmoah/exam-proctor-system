import React from 'react';
import { ArrowLeftIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';

const LessonView: React.FC = () => {
  const { lessons, activeCourseId, dispatch } = useAppContext();
  
  // For simplicity, showing the first lesson of the current course. 
  // A real implementation would track the selected lesson.
  const lesson = lessons.find(l => l.courseId === activeCourseId);

  const handleBack = () => {
    dispatch({ type: 'SET_STUDENT_VIEW', payload: 'COURSE_DETAIL' });
  };

  if (!lesson) {
    return <div className="text-center">Lesson not found.</div>;
  }
  
  return (
    <div>
       <button onClick={handleBack} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6">
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to Course
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{lesson.title}</h2>
        
        <div className="mt-6 prose prose-lg dark:prose-invert max-w-none">
            {lesson.type === 'video' && lesson.videoUrl && (
                 <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                        src={lesson.videoUrl}
                        title={lesson.title} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                        className="w-full h-full rounded-md"
                    ></iframe>
                </div>
            )}
            <p>{lesson.content}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonView;
