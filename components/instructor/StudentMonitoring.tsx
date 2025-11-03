import React, { useState, useMemo, useEffect } from 'react';
import { FlaggedEvent, FlagType, StudentProgress, ExamStatus, QuestionType, Course, Exam, Question, User, Role, StudentExamProgress } from '../../types';
import { FLAG_DETAILS } from '../../constants';
import { XIcon, CheckCircleIcon, ThumbUpIcon, ThumbDownIcon } from '../icons/Icons';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { saveStudentProgress } from '../../services/api';
import ConfirmationModal from '../common/ConfirmationModal';


const FlagDetailsModal: React.FC<{ event: FlaggedEvent; onClose: () => void }> = ({ event, onClose }) => {
  const details = FLAG_DETAILS[event.type];
  const riskColorClasses = {
    Low: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">Flagged Event Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <img src={event.snapshotUrl} alt={`Snapshot for ${event.type}`} className="w-full h-auto object-cover rounded-md border border-gray-300 dark:border-gray-600 mb-4" />
          <div className="space-y-3">
            <div className="flex items-center">
                <details.icon className={`w-6 h-6 mr-3 ${details.color}`} />
                <p className={`text-lg font-semibold ${details.color}`}>{details.text}</p>
            </div>
             <p><strong>Student:</strong> {event.studentName}</p>
             <p><strong>Timestamp:</strong> {event.timestamp.toLocaleString()}</p>
             <p className="flex items-center"><strong>Risk Level:</strong> 
                <span className={`ml-2 px-2.5 py-0.5 text-sm font-semibold rounded-full ${riskColorClasses[event.riskLevel]}`}>
                    {event.riskLevel}
                </span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ExamReviewModalProps {
    progress: StudentExamProgress;
    exam: Exam;
    studentName: string;
    studentId: string;
    events: FlaggedEvent[];
    onClose: () => void;
}

const ExamReviewModal: React.FC<ExamReviewModalProps> = ({ progress, exam, studentName, studentId, events, onClose }) => {
    const { dispatch } = useAppContext();
    const addToast = useToast();
    const [gradedAnswers, setGradedAnswers] = useState<Record<string, boolean>>(progress.gradedAnswers || {});
    const [isConfirming, setIsConfirming] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<FlaggedEvent | null>(null);

    const examEvents = useMemo(() => {
        if (!progress.startTime || !progress.endTime) return [];
        const start = new Date(progress.startTime);
        const end = new Date(progress.endTime);
        return events.filter(e => {
            const eventTime = new Date(e.timestamp);
            return eventTime >= start && eventTime <= end;
        });
    }, [events, progress.startTime, progress.endTime]);

    const handleManualGrade = (questionId: string, isCorrect: boolean) => {
        setGradedAnswers(prev => ({ ...prev, [questionId]: isCorrect }));
    };
    
    const totalPoints = useMemo(() => {
        return exam.questions.reduce((total, q) => total + q.points, 0);
    }, [exam.questions]);

    const finalScore = useMemo(() => {
        return exam.questions.reduce((score, q) => {
            if (gradedAnswers[q.id]) {
                return score + q.points;
            }
            return score;
        }, 0);
    }, [gradedAnswers, exam.questions]);

    const isGradingComplete = exam.questions.every(q => gradedAnswers[q.id] !== undefined);

    const handleConfirmPublish = async () => {
        if (!isGradingComplete) return;

        try {
            const updatedProgress = {
                ...progress,
                status: ExamStatus.GRADED,
                score: finalScore,
                gradedAnswers,
                gradedAt: new Date(),
            };
            await saveStudentProgress(studentId, exam.id, updatedProgress);
            dispatch({ type: 'UPDATE_STUDENT_PROGRESS', payload: { studentId, examId: exam.id, progress: updatedProgress } });
            addToast('Grades published successfully!', 'success');
            onClose();
        } catch (error: any) {
            addToast(`Error: ${error.message}`, 'error');
        } finally {
            setIsConfirming(false);
        }
    };
    
    const isMCQCorrect = (q: Question) => {
        const answer = progress.answers[q.id];
        if (q.type === QuestionType.CHECKBOX) {
            const correctSet = new Set(q.correctAnswers);
            const answerSet = new Set(answer);
            return correctSet.size === answerSet.size && [...correctSet].every(item => answerSet.has(item));
        }
        return Array.isArray(answer) ? false : q.correctAnswers?.includes(answer) ?? false;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold">Exam Review & Grading: {exam.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Student: {studentName}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Flagged Events During Exam ({examEvents.length})</h4>
                            {examEvents.length > 0 ? (
                                <div className="space-y-2 max-h-48 overflow-y-auto border dark:border-gray-700 p-2 rounded-md">
                                    {examEvents.map(event => {
                                        const details = FLAG_DETAILS[event.type];
                                        return (
                                            <button key={event.id} onClick={() => setSelectedEvent(event)} className="w-full text-left flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                                <details.icon className={`w-5 h-5 mr-3 ${details.color}`} />
                                                <div className="flex-grow">
                                                    <p className="font-medium text-sm">{details.text}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{event.timestamp.toLocaleTimeString()}</p>
                                                </div>
                                                <span className={`text-xs font-bold ${details.color}`}>{event.riskLevel}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No flagged events were recorded during this exam session.</p>
                            )}
                        </div>

                        {exam.questions.map((q, index) => (
                            <div key={q.id} className="p-4 rounded-md bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">Q{index + 1} ({q.points} pts): {q.text}</p>
                                
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Student's Answer:</p>
                                    <p className="text-md text-gray-900 dark:text-white font-mono p-2 bg-gray-100 dark:bg-gray-800 rounded mt-1">
                                        {Array.isArray(progress.answers[q.id]) ? (progress.answers[q.id] as string[]).join(', ') : progress.answers[q.id] || <span className="italic text-gray-400">Not answered</span>}
                                    </p>
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Grading:</p>
                                    {q.type !== QuestionType.SHORT_ANSWER ? (
                                        <div className={`flex items-center p-2 rounded-md text-sm ${isMCQCorrect(q) ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                                            {isMCQCorrect(q) ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XIcon className="w-5 h-5 mr-2" />}
                                            Auto-graded: {isMCQCorrect(q) ? 'Correct' : 'Incorrect'}. Correct answer(s): {q.correctAnswers?.join(', ')}
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleManualGrade(q.id, true)} className={`flex items-center px-3 py-1 text-sm rounded-md ${gradedAnswers[q.id] === true ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                                <ThumbUpIcon className="w-4 h-4 mr-1" /> Mark Correct
                                            </button>
                                            <button onClick={() => handleManualGrade(q.id, false)} className={`flex items-center px-3 py-1 text-sm rounded-md ${gradedAnswers[q.id] === false ? 'bg-red-600 text-white' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                                <ThumbDownIcon className="w-4 h-4 mr-1" /> Mark Incorrect
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
                        <p className="text-lg font-bold">Final Score: {finalScore} / {totalPoints}</p>
                        <button onClick={() => setIsConfirming(true)} disabled={!isGradingComplete} className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            <CheckCircleIcon className="w-5 h-5 mr-2" />
                            {isGradingComplete ? 'Publish Grades' : 'Complete Grading to Publish'}
                        </button>
                    </div>
                </div>
            </div>
            {selectedEvent && <FlagDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
            {isConfirming && (
                <ConfirmationModal
                    title="Publish Grades"
                    message={`Are you sure you want to publish the final score of ${finalScore}/${totalPoints} for ${studentName}? This action cannot be undone.`}
                    onConfirm={handleConfirmPublish}
                    onCancel={() => setIsConfirming(false)}
                />
            )}
        </>
    );
};

interface StudentDisplayData {
    id: string;
    name: string;
    events: FlaggedEvent[];
    highRiskCount: number;
    exams: {
      examId: string;
      status: ExamStatus;
      progress: StudentExamProgress;
    }[];
}

const StudentMonitoring: React.FC = () => {
  const { flaggedEvents, studentProgress, users, exams } = useAppContext();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<FlagType>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<FlaggedEvent | null>(null);
  const [reviewingExam, setReviewingExam] = useState<{studentId: string, examId: string, progress: StudentExamProgress} | null>(null);

  const studentsData = useMemo<StudentDisplayData[]>(() => {
    const studentMap = new Map<string, StudentDisplayData>();

    users.filter(u => u.role === Role.STUDENT).forEach(student => {
        studentMap.set(student.id, {
            id: student.id,
            name: student.name,
            events: [],
            highRiskCount: 0,
            exams: []
        });
    });

    flaggedEvents.forEach(event => {
        const student = studentMap.get(event.studentId);
        if (student) {
            student.events.push(event);
            if (event.riskLevel === 'High') {
                student.highRiskCount++;
            }
        }
    });

    Object.entries(studentProgress).forEach(([studentId, examsProgress]) => {
        const student = studentMap.get(studentId);
        if (student && examsProgress) {
            student.exams = Object.entries(examsProgress).map(([examId, progress]) => ({
                examId,
                status: progress.status,
                progress,
            }));
        }
    });

    return Array.from(studentMap.values()).filter(
        s => s.events.length > 0 || s.exams.length > 0
    );
  }, [flaggedEvents, studentProgress, users]);

  const filteredEvents = useMemo(() => {
    if (!selectedStudentId) return [];
    const events = studentsData.find(s => s.id === selectedStudentId)?.events || [];
    if (activeFilters.size === 0) return events;
    return events.filter(event => activeFilters.has(event.type));
  }, [selectedStudentId, studentsData, activeFilters]);
  
  useEffect(() => {
    if (!selectedStudentId && studentsData.length > 0) {
      setSelectedStudentId(studentsData[0].id);
    } else if (selectedStudentId && !studentsData.find(s => s.id === selectedStudentId)) {
      setSelectedStudentId(studentsData.length > 0 ? studentsData[0].id : null);
    }
  }, [studentsData, selectedStudentId]);

  const toggleFilter = (flagType: FlagType) => {
    setActiveFilters(prev => {
        const newSet = new Set(prev);
        if (newSet.has(flagType)) newSet.delete(flagType); else newSet.add(flagType);
        return newSet;
    });
  };
  
  const handleReviewClick = (studentId: string, examId: string) => {
      const studentData = studentsData.find(s => s.id === studentId);
      const examProgress = studentData?.exams.find(e => e.examId === examId);
      if (examProgress && examProgress.status === ExamStatus.SUBMITTED) {
          setReviewingExam({ studentId, examId, progress: examProgress.progress });
      }
  };

  const statusColors: Record<ExamStatus, string> = {
    [ExamStatus.NOT_STARTED]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [ExamStatus.IN_PROGRESS]: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200 animate-pulse',
    [ExamStatus.SUBMITTED]: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [ExamStatus.GRADED]: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const selectedStudentData = studentsData.find(s => s.id === selectedStudentId);

  return (
    <>
       {studentsData.length === 0 ? (
         <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-lg text-gray-500 dark:text-gray-400">No active students or events to display.</p>
         </div>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Monitored Students</h3>
                <div className="space-y-2">
                    {studentsData.map(student => (
                        <button key={student.id} onClick={() => setSelectedStudentId(student.id)}
                            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${selectedStudentId === student.id ? 'bg-indigo-100 dark:bg-indigo-900' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{student.name}</span>
                                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${student.highRiskCount > 0 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200'}`}>{student.events.length} flags</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Details for <span className="text-indigo-500">{selectedStudentData?.name}</span></h3>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Exams</h4>
                  <div className="space-y-2">
                    {selectedStudentData?.exams.map(({examId, status}) => (
                      <div key={examId} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <p className="font-medium">{exams[examId]?.title || 'Unknown Exam'}</p>
                        <div className="flex items-center space-x-4">
                          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[status]}`}>{status}</span>
                          {status === ExamStatus.SUBMITTED && (
                            <button onClick={() => handleReviewClick(selectedStudentData.id, examId)} className="flex items-center px-3 py-1 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                                Review & Grade
                            </button>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-semibold">Event Log</h4>
                  <div className="my-4 flex flex-wrap gap-2">
                      {Object.values(FlagType).map(type => (
                          <button key={type} onClick={() => toggleFilter(type)} className={`px-3 py-1 text-sm rounded-full border-2 ${activeFilters.has(type) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'}`}>
                              {FLAG_DETAILS[type].text}
                          </button>
                      ))}
                  </div>
                  <div className="mt-4 space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                      {filteredEvents.map(event => {
                          const details = FLAG_DETAILS[event.type];
                          return (
                            <div key={event.id} onClick={() => setSelectedEvent(event)} className="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                              <img src={event.snapshotUrl} alt={`Snapshot`} className="w-24 h-18 object-cover rounded-md border border-gray-300 dark:border-gray-600" />
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <details.icon className={`w-5 h-5 mr-2 ${details.color}`} />
                                  <p className={`font-semibold ${details.color}`}>{details.text}</p>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{event.timestamp.toLocaleTimeString()}</p>
                              </div>
                            </div>
                          );
                      })}
                       {filteredEvents.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No events match the current filter.</p>}
                  </div>
                </div>
            </div>
        </div>
       )}
       {selectedEvent && <FlagDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
       {reviewingExam && exams[reviewingExam.examId] && selectedStudentData && (
          <ExamReviewModal 
            exam={exams[reviewingExam.examId]} 
            progress={reviewingExam.progress} 
            studentName={selectedStudentData.name} 
            studentId={reviewingExam.studentId}
            events={selectedStudentData.events}
            onClose={() => setReviewingExam(null)} 
          />
        )}
    </>
  );
}


export default StudentMonitoring;