import React, { useState } from 'react';
import { ProctoringSettings, ProctoringSensitivity, FlagType } from '../types';
import { FLAG_DETAILS } from '../constants';
import { SaveIcon } from './icons/Icons';
import { useAppContext } from '../hooks/useAppContext';
import { useToast } from '../hooks/useToast';
import { saveProctoringSettings } from '../services/api';

const ProctoringSettingsComponent: React.FC = () => {
    const { proctoringSettings, dispatch } = useAppContext();
    const addToast = useToast();
    const [currentSettings, setCurrentSettings] = useState<ProctoringSettings>(proctoringSettings);
    const [isSaved, setIsSaved] = useState(false);

    const sensitivityLevels: ProctoringSensitivity[] = ['Low', 'Medium', 'High'];
    const sensitivityColors: Record<ProctoringSensitivity, string> = {
        Low: 'bg-yellow-500',
        Medium: 'bg-orange-500',
        High: 'bg-red-500',
    };

    const handleSensitivityChange = (flagType: FlagType, sensitivity: ProctoringSensitivity) => {
        setCurrentSettings(prev => ({
            ...prev,
            sensitivities: {
                ...prev.sensitivities,
                [flagType]: sensitivity,
            }
        }));
    };
    
    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        setCurrentSettings(prev => ({
            ...prev,
            autoFailThreshold: isNaN(value) ? 0 : value,
        }));
    };

    const handleSaveChanges = async () => {
        try {
            const saved = await saveProctoringSettings(currentSettings);
            dispatch({ type: 'SAVE_PROCTORING_SETTINGS_SUCCESS', payload: saved });
            addToast('Proctoring settings saved!', 'success');
        } catch (e: any) {
            addToast(e.message, 'error');
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4">AI Proctoring Settings</h3>

            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Flag Sensitivity</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Adjust the risk level assigned to each type of flagged event.</p>
                    <div className="space-y-4">
                        {Object.values(FlagType).map(type => {
                            const details = FLAG_DETAILS[type];
                            const currentSensitivity = currentSettings.sensitivities[type];
                            return (
                                <div key={type} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                    <div className="flex items-center col-span-1">
                                        <details.icon className={`w-6 h-6 mr-3 ${details.color}`} />
                                        <span className="font-medium">{details.text}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${sensitivityColors[currentSensitivity]} text-white`}>
                                                        {currentSensitivity}
                                                    </span>
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="2"
                                                value={sensitivityLevels.indexOf(currentSensitivity)}
                                                onChange={(e) => handleSensitivityChange(type, sensitivityLevels[parseInt(e.target.value, 10)])}
                                                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                                style={{ accentColor: 'rgb(79 70 229)'}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Automated Actions</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Set thresholds for automated exam grading based on flag counts.</p>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <label htmlFor="autoFail" className="font-medium mr-4">Automatically fail exam after</label>
                        <input
                            type="number"
                            id="autoFail"
                            value={currentSettings.autoFailThreshold}
                            onChange={handleThresholdChange}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500"
                        />
                        <span className="ml-2 font-medium">High-Risk flags.</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center">
                 {isSaved && <p className="text-green-600 dark:text-green-400 mr-4 transition-opacity duration-300">Settings saved!</p>}
                <button 
                    onClick={handleSaveChanges} 
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default ProctoringSettingsComponent;
