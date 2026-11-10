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

                </div>

                {/* TODO: Display error if present */}
                {/* TODO: Display lastResult details if present */}
                {error && error}
                {lastResult && <img src={lastResult.image_url} alt={lastResult.name} className="object-contain w-full h-full" />}

            </div>
        </div>
    );
}

export default GeneratorPage;