import React from 'react';
import { Question, QuestionType } from '../../types';
import { TrashIcon, PlusIcon, CheckCircleIcon, DotsVerticalIcon } from '../icons/Icons';

interface QuestionEditorProps {
    question: Question;
    index: number;
    onChange: (question: Question) => void;
    onDelete: (questionId: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, index, onChange, onDelete }) => {

    const handleFieldChange = (field: keyof Question, value: any) => {
        onChange({ ...question, [field]: value });
    };

    const handleOptionChange = (optionIndex: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[optionIndex] = value;
        handleFieldChange('options', newOptions);
    };
    
    const handleAddOption = () => {
        const newOptions = [...(question.options || []), `Option ${ (question.options?.length || 0) + 1}`];
        handleFieldChange('options', newOptions);
    };

    const handleRemoveOption = (optionIndex: number) => {
        const newOptions = (question.options || []).filter((_, i) => i !== optionIndex);
        handleFieldChange('options', newOptions);
    };
    
    const handleCorrectAnswerChange = (option: string) => {
        const type = question.type;
        let newCorrect: string[] = [];

        if (type === QuestionType.MCQ || type === QuestionType.DROPDOWN) {
            newCorrect = [option];
        } else if (type === QuestionType.CHECKBOX) {
            const currentCorrect = new Set(question.correctAnswers || []);
            if (currentCorrect.has(option)) {
                currentCorrect.delete(option);
            } else {
                currentCorrect.add(option);
            }
            {/* FIX: Use spread syntax instead of Array.from to ensure correct type inference. */}
            newCorrect = [...currentCorrect];
        }
        handleFieldChange('correctAnswers', newCorrect);
    };

    const isOptionCorrect = (option: string) => (question.correctAnswers || []).includes(option);

    const renderOptionsEditor = () => {
        const type = question.type;
        if (type !== QuestionType.MCQ && type !== QuestionType.CHECKBOX && type !== QuestionType.DROPDOWN) {
            return null;
        }

        const inputType = type === QuestionType.MCQ || type === QuestionType.DROPDOWN ? 'radio' : 'checkbox';

        return (
            <div className="space-y-3 mt-4">
                {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center group">
                        <input
                            type={inputType}
                            name={`correct-answer-${question.id}`}
                            checked={isOptionCorrect(option)}
                            onChange={() => handleCorrectAnswerChange(option)}
                            className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                            className="ml-3 flex-grow p-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 outline-none"
                        />
                         <button onClick={() => handleRemoveOption(optIndex)} className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                 <button onClick={handleAddOption} className="text-indigo-600 dark:text-indigo-400 text-sm font-medium flex items-center">
                    <PlusIcon className="w-4 h-4 mr-1" /> Add Option
                </button>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg relative border-l-4 border-indigo-500">
            <div className="flex justify-between items-start gap-4">
                 <textarea
                    value={question.text}
                    onChange={(e) => handleFieldChange('text', e.target.value)}
                    className="flex-grow text-lg font-semibold p-2 -m-2 bg-transparent rounded-md focus:bg-gray-100 dark:focus:bg-gray-700 resize-none border-none outline-none"
                    rows={2}
                />
                <select value={question.type} onChange={e => handleFieldChange('type', e.target.value)} className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                    <option value={QuestionType.MCQ}>Multiple Choice</option>
                    <option value={QuestionType.CHECKBOX}>Checkboxes</option>
                    <option value={QuestionType.DROPDOWN}>Dropdown</option>
                    <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                </select>
            </div>

            {renderOptionsEditor()}
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-4">
                 <div className="flex items-center">
                    <label htmlFor={`points-${question.id}`} className="mr-2 text-sm font-medium">Points:</label>
                    <input
                        id={`points-${question.id}`}
                        type="number"
                        value={question.points}
                        onChange={(e) => handleFieldChange('points', parseInt(e.target.value))}
                        className="w-16 p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    />
                </div>

                <div className="w-px h-6 bg-gray-200 dark:bg-gray-600"></div>

                 <label htmlFor={`required-${question.id}`} className="flex items-center text-sm font-medium cursor-pointer">
                    <input
                        id={`required-${question.id}`}
                        type="checkbox"
                        checked={question.isRequired}
                        onChange={(e) => handleFieldChange('isRequired', e.target.checked)}
                         className="h-4 w-4 text-indigo-600 rounded"
                    />
                    <span className="ml-2">Required</span>
                </label>

                <button onClick={() => onDelete(question.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                
                <DotsVerticalIcon className="w-5 h-5 text-gray-400 cursor-grab" />
            </div>
        </div>
    );
};

export default QuestionEditor;