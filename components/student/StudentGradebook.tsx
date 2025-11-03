import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

interface StudentGradebookProps {
  courseId: string;
}

const StudentGradebook: React.FC<StudentGradebookProps> = ({ courseId }) => {
  const { currentUser, assignments, submissions, exams, studentProgress, courses } = useAppContext();
  
  if (!currentUser) return null;
  
  const courseAssignments = assignments.filter(a => a.courseId === courseId);
  const course = courses.find(c => c.id === courseId);
  const exam = course ? exams[course.examId] : null;
  const examProgress = (course && currentUser) ? studentProgress[currentUser.id]?.[course.examId] : null;

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Grades</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {courseAssignments.map(assignment => {
              const submission = submissions.find(s => s.assignmentId === assignment.id && s.studentId === currentUser.id);
              return (
                <tr key={assignment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{assignment.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {submission ? (submission.grade !== undefined ? 'Graded' : 'Submitted') : 'Not Submitted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {submission?.grade !== undefined ? `${submission.grade} / 100` : '—'}
                  </td>
                </tr>
              );
            })}
            {exam && examProgress && (
                <tr className="bg-gray-50 dark:bg-gray-700/50 font-bold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{exam.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{examProgress.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                       {examProgress.status === 'Graded' ? `${examProgress.score} / ${exam.questions.length}` : '—'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentGradebook;
