import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import { useToast } from '../../hooks/useToast';
import { Exam, Question, QuestionType } from '../../types';
import { saveExam } from '../../services/api';
import { ArrowLeftIcon, SaveIcon, PlusIcon } from '../icons/Icons';
import QuestionEditor from './QuestionEditor';

const ExamBuilder: React.FC = () => {
    const { exams, activeExamId, dispatch } = useAppContext();
    const addToast = useToast();
    const [exam, setExam] = useState<Exam | null>(null);

    useEffect(() => {
        if (activeExamId && exams[activeExamId]) {
            // Deep copy to prevent direct state mutation
            setExam(JSON.parse(JSON.stringify(exams[activeExamId])));
        }
    }, [activeExamId, exams]);

    const handleExamChange = (field: keyof Exam, value: any) => {
        setExam(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleQuestionChange = (updatedQuestion: Question) => {
        setExam(prev => {
            if (!prev) return null;
            const newQuestions = prev.questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
            return { ...prev, questions: newQuestions };
        });
    };
    
    const handleAddQuestion = () => {
        const newQuestion: Question = {
            id: `q-${Date.now()}`,
            text: 'New Question',
            type: QuestionType.MCQ,
            points: 10,
            isRequired: false,
            options: ['Option 1'],
            correctAnswers: [],
        };
        setExam(prev => prev ? { ...prev, questions: [...prev.questions, newQuestion] } : null);
    };

    const handleDeleteQuestion = (questionId: string) => {
        setExam(prev => prev ? { ...prev, questions: prev.questions.filter(q => q.id !== questionId) } : null);
    };

    const handleSaveExam = async () => {
        if (!exam) return;
        try {
            const saved = await saveExam(exam);
            dispatch({ type: 'SAVE_EXAM_SUCCESS', payload: saved });
            addToast('Exam saved successfully!', 'success');
            dispatch({ type: 'CLOSE_EXAM_BUILDER' });
        } catch (e: any) {
            addToast(`Error: ${e.message}`, 'error');
        }
    };
    
    const handleClose = () => {
        dispatch({ type: 'CLOSE_EXAM_BUILDER' });
    };

    if (!exam) return <div className="p-8">Loading exam builder...</div>;

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-full">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                <div className="flex items-center">
                    <button onClick={handleClose} className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Back to Course
                    </button>
                    <input type="text" value={exam.title} onChange={e => handleExamChange('title', e.target.value)} className="text-xl font-bold ml-4 p-1 bg-transparent rounded-md focus:ring-2 ring-indigo-500" />
                </div>
                <button onClick={handleSaveExam} className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Exam
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                {/* Exam Settings */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8 space-y-4">
                     <h2 className="text-xl font-bold border-b dark:border-gray-700 pb-2">Exam Settings</h2>
                     <div className="flex items-center justify-between">
                        <label htmlFor="duration" className="font-medium">Duration (minutes)</label>
                        <input type="number" id="duration" value={exam.durationMinutes} onChange={e => handleExamChange('durationMinutes', parseInt(e.target.value))} className="w-24 p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600" />
                     </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="shuffleQuestions" checked={exam.shuffleQuestions} onChange={e => handleExamChange('shuffleQuestions', e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" />
                        {/* FIX: Corrected malformed JSX in label. */}
                        <label htmlFor="shuffleQuestions" className="ml-2">Shuffle question order for each student</label>
                     </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="shuffleOptions" checked={exam.shuffleOptions} onChange={e => handleExamChange('shuffleOptions', e.target.checked)} className="h-4 w-4 text-indigo-600 rounded" />
                        {/* FIX: Corrected malformed JSX in label. */}
                        <label htmlFor="shuffleOptions" className="ml-2">Shuffle option order for each question</label>
                     </div>
                </div>

                {/* Questions */}
                <div className="space-y-6">
                    {exam.questions.map((question, index) => (
                        <QuestionEditor key={question.id} question={question} index={index} onChange={handleQuestionChange} onDelete={handleDeleteQuestion} />
                    ))}
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={handleAddQuestion} className="flex items-center mx-auto px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Add Question
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExamBuilder;