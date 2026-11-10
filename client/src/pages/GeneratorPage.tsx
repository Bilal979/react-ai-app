import { useState } from "react";
import type { PokAImon, APIResponse } from "../types";
import Canvas from "../components/Canvas";
import Spinner from "../components/Spinner";
import axios from "axios";

const GeneratorPage = () => {
    const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResult, setLastResult] = useState<PokAImon | null>(null);

    const handleGenerate = async (base64: string) => {
        setIsGenerating(true);
        setError(null);
        const url = `${API}/api/generate`;
        try {
            const resp = await axios.post<APIResponse<PokAImon>>(url, { doodle_data: base64 });
            console.log('the server response code is ', resp.status)
            if (resp.status !== 201) {
                throw new Error();
            }
            const data = resp.data.data;
            setLastResult(data);

        } catch (e) {
            console.log(e);
            setError('Could not generate PokAImon');
        } finally {
            setIsGenerating(false);
        }



    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <Canvas
                onGenerate={handleGenerate}
                disabled={isGenerating}
            />

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-colors">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white">
                    PokAImon Result
                </h2>
                <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-gray-700 overflow-hidden p-2">
                    {/* TODO: Add conditional rendering based on state */}
                    {isGenerating && <Spinner label="Generating your Pokemaon" />}
                    {!lastResult && !isGenerating && <div className="text-center text-gray-500 dark:text-gray-400">
                        <p>Your generated PokAImon will appear here.</p>
                    </div>}
                    {lastResult && <img src={API + '' + lastResult.image_url} alt={lastResult.name} className="object-contain w-full h-full" />}

                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-4 text-red-500 dark:text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Generated PokAImon details */}
                {lastResult && !isGenerating && (
                    <div className="w-full mt-6 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-5 space-y-4 text-left transition-colors">
                        {/* Header: Name and Type */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lastResult.name}
                            </h3>
                            {lastResult.type && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                    {lastResult.type}
                                </span>
                            )}
                        </div>

                        {/* Characteristics */}
                        {lastResult.characteristics && (
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                    Characteristics
                                </h4>
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                    "{lastResult.characteristics}"
                                </p>
                            </div>
                        )}

                        {/* Powers */}
                        {lastResult.powers && lastResult.powers.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                                    Powers & Abilities
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {lastResult.powers.map((power, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white dark:bg-gray-800 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700"
                                        >
                                            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                                                {power.name}
                                            </span>
                                            <span className="block text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                                {power.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
}

export default GeneratorPage;