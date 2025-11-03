import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FlaggedEvent, FlagType, ExamStatus, Question, QuestionType } from '../types';
import WebcamFeed from './WebcamFeed';
import { ClockIcon, CheckCircleIcon, ShieldCheckIcon, EyeIcon, MicrophoneIcon, DesktopComputerIcon, ExternalLinkIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { saveStudentProgress } from '../services/api';

const ProctoringStatus: React.FC = () => {
    const statuses = [
        { icon: ShieldCheckIcon, text: "Identity Verified", enabled: true },
        { icon: EyeIcon, text: "Gaze Tracking Active", enabled: true },
        { icon: MicrophoneIcon, text: "Audio Analysis Active", enabled: true },
        { icon: DesktopComputerIcon, text: "Browser Lock Enabled", enabled: true },
        { icon: ExternalLinkIcon, text: "Tab Focus Monitored", enabled: true },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-center">AI Security Shield</h3>
            <div className="space-y-3">
                {statuses.map((status, index) => (
                    <div key={index} className={`flex items-center p-2 rounded-md ${status.enabled ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        <status.icon className={`w-6 h-6 mr-3 ${status.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium ${status.enabled ? 'text-green-800 dark:text-green-200' : 'text-gray-600 dark:text-gray-300'}`}>
                            {status.text}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const StudentExamView: React.FC = () => {
  const { currentUser, courses, activeCourseId, exams, proctoringSettings, dispatch } = useAppContext();
  const addToast = useToast();
  
  const activeCourse = courses.find(c => c.id === activeCourseId);
  const exam = activeCourse ? exams[activeCourse.examId] : null;

  const [timeLeft, setTimeLeft] = useState(exam?.durationMinutes ? exam.durationMinutes * 60 : 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [captureTrigger, setCaptureTrigger] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const lastFlagType = useRef<FlagType | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);
  
  const shuffledOptions = useMemo(() => {
    const optionsMap = new Map<string, string[]>();
    if (exam?.shuffleOptions) {
        exam.questions.forEach(q => {
            if (q.options) {
                optionsMap.set(q.id, shuffleArray(q.options));
            }
        });
    }
    return optionsMap;
  }, [exam]);

  useEffect(() => {
    if (exam) {
        setShuffledQuestions(exam.shuffleQuestions ? shuffleArray(exam.questions) : exam.questions);
    }
  }, [exam]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
            handleSubmit(answers);
            return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answers]);

  const onFlagEvent = useCallback((event: Omit<FlaggedEvent, 'id' | 'timestamp' | 'studentName'>) => {
    if (!currentUser) return;
    const newEvent: FlaggedEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      studentName: currentUser.name,
    };
    dispatch({ type: 'ADD_FLAGGED_EVENT', payload: newEvent });
  }, [currentUser, dispatch]);

  const triggerFlag = useCallback((flagType: FlagType) => {
    lastFlagType.current = flagType;
    setCaptureTrigger(Date.now());
  }, []);

  const handleCapture = useCallback((snapshotUrl: string) => {
    const flagType = lastFlagType.current;
    if (!flagType || !currentUser) return;
    
    onFlagEvent({
      studentId: currentUser.id,
      type: flagType,
      snapshotUrl,
      riskLevel: proctoringSettings.sensitivities[flagType],
    });
    lastFlagType.current = null; // Reset after capture
  }, [onFlagEvent, currentUser, proctoringSettings]);

  useEffect(() => {
    // Simulation and event listeners setup
    simulationIntervalRef.current = window.setInterval(() => {
      const flagTypes = [FlagType.LOOKING_AWAY, FlagType.PHONE_DETECTED, FlagType.MULTIPLE_PEOPLE, FlagType.SUSPICIOUS_AUDIO];
      const randomFlagType = flagTypes[Math.floor(Math.random() * flagTypes.length)];
      triggerFlag(randomFlagType);
    }, 15000); 

    const handleVisibilityChange = () => document.hidden && triggerFlag(FlagType.TAB_SWITCH);
    const handleFullscreenChange = () => !document.fullscreenElement && triggerFlag(FlagType.FULLSCREEN_EXIT);
    const preventDefault = (e: Event) => e.preventDefault();
    const keydownListener = (e: KeyboardEvent) => (e.ctrlKey && (e.key === 'c' || e.key === 'v')) && preventDefault(e);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('keydown', keydownListener);

    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('keydown', keydownListener);
      if (document.fullscreenElement) document.exitFullscreen();
    };
  }, [triggerFlag]);

  const handleSubmit = useCallback(async (finalAnswers: Record<string, string | string[]>) => {
    if (!activeCourse || !currentUser || !exam) return;
    
    const gradedAnswers: Record<string, boolean> = {};
    let score = 0;
    
    exam.questions.forEach(q => {
        const answer = finalAnswers[q.id];
        let isCorrect = false;
        if (q.type === QuestionType.MCQ || q.type === QuestionType.DROPDOWN) {
            isCorrect = Array.isArray(answer) ? false : q.correctAnswers?.includes(answer) ?? false;
        } else if (q.type === QuestionType.CHECKBOX) {
            const correctSet = new Set(q.correctAnswers);
            const answerSet = new Set(answer);
            isCorrect = correctSet.size === answerSet.size && [...correctSet].every(item => answerSet.has(item));
        }

        if (q.type !== QuestionType.SHORT_ANSWER) {
            gradedAnswers[q.id] = isCorrect;
            if (isCorrect) score += q.points;
        }
    });
    
    const progress = {
        status: ExamStatus.SUBMITTED,
        answers: finalAnswers,
        score,
        gradedAnswers,
        endTime: new Date(),
    };

    try {
        await saveStudentProgress(currentUser.id, activeCourse.examId, progress);
        dispatch({ type: 'UPDATE_STUDENT_PROGRESS', payload: { studentId: currentUser.id, examId: activeCourse.examId, progress }});
        dispatch({ type: 'SET_STUDENT_VIEW', payload: 'EXAM_RESULTS' });
        addToast('Exam submitted successfully!', 'success');
    } catch (error: any) {
        addToast(`Error submitting exam: ${error.message}`, 'error');
    }
  }, [activeCourse, currentUser, exam, dispatch, addToast]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleCheckboxChange = (questionId: string, option: string) => {
    setAnswers(prev => {
        const currentAns = prev[questionId] || [];
        const newAns = Array.isArray(currentAns) ? [...currentAns] : [];
        if (newAns.includes(option)) {
            return { ...prev, [questionId]: newAns.filter(item => item !== option) };
        } else {
            return { ...prev, [questionId]: [...newAns, option] };
        }
    });
  };

  if (!exam || !currentUser || shuffledQuestions.length === 0) return <div>Loading exam...</div>;

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const questionOptions = shuffledOptions.get(currentQuestion.id) || currentQuestion.options || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{exam.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Student: {currentUser.name}</p>
          </div>
          <div className="flex items-center text-lg font-semibold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-md">
            <ClockIcon className="w-6 h-6 mr-2" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mt-6">
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Question {currentQuestionIndex + 1} of {exam.questions.length} ({currentQuestion.points} points)</p>
            <h3 className="mt-1 text-lg font-medium text-gray-900 dark:text-white">{currentQuestion.text} {currentQuestion.isRequired && <span className="text-red-500">*</span>}</h3>
            <div className="mt-4 space-y-3">
              {currentQuestion.type === QuestionType.MCQ && questionOptions.map(option => (
                <label key={option} className="flex items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input type="radio" name={currentQuestion.id} value={option} checked={answers[currentQuestion.id] === option} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
              {currentQuestion.type === QuestionType.CHECKBOX && questionOptions.map(option => (
                 <label key={option} className="flex items-center p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <input type="checkbox" name={currentQuestion.id} value={option} checked={(answers[currentQuestion.id] as string[] || []).includes(option)} onChange={() => handleCheckboxChange(currentQuestion.id, option)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{option}</span>
                </label>
              ))}
               {currentQuestion.type === QuestionType.DROPDOWN && (
                    <select onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)} value={answers[currentQuestion.id] as string || ''} className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select an answer...</option>
                        {questionOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
               )}
              {currentQuestion.type === QuestionType.SHORT_ANSWER && (
                <textarea rows={4} value={answers[currentQuestion.id] as string || ''} onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your answer here..."
                />
              )}
            </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
            <button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev-1))} disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
              Previous
            </button>
            <button onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))} disabled={currentQuestionIndex === exam.questions.length - 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
              Next
            </button>
        </div>
      </div>
      
      <div className="space-y-6">
        <WebcamFeed captureTrigger={captureTrigger} onCapture={handleCapture} />
        <ProctoringStatus />
        <button onClick={() => handleSubmit(answers)} className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default StudentExamView;