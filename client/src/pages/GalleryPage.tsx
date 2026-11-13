import axios from "axios";

import Spinner from "../components/Spinner.jsx";
import usePokemonGallery from "../hooks/usePokemonGallery.js";
import { useState, useMemo } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const GalleryPage = () => {
    const { data, loading, error, refetch } = usePokemonGallery();
    const [likeError, setLikeError] = useState<string | null>(null);
    const [likeLoading, setLikeLoading] = useState(false);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [filterType, setFilterType] = useState<string>('all');

    const availableTypes = useMemo(() => new Set(data.map(elem => elem.type).filter(Boolean)), [data]);

    const processedData = useMemo(() => {
        let result = [...data];

        if (filterType != 'all') {
            result = result.filter(elem => elem.type && elem.type.toLocaleLowerCase() === filterType.toLocaleLowerCase());
        }

        if (sortBy === 'likes') {
            result.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
        } else if (sortBy === 'name') {
            result.sort((a, b) => a.name.localeCompare(b.name))
        }
        return result;
    }, [data, sortBy, filterType])



    const like = async (id: string) => {
        try {
            setLikeLoading(true);
            setLikeError(null);
            const url = `${API}/api/pokaimon/${id}/like`;
            await axios.patch(url);
            refetch();
        } catch (e) {
            setLikeError("Could not add like");
        } finally {
            setLikeLoading(false);
        }
    }
    if (loading && data.length === 0) return <Spinner label="Loading gallery…" />;
    if (error)
        return (
            <div className="text-red-500 dark:text-red-400">
                {String(error)}
            </div>
        );



    return (
        <div>
            {likeError && <div className="text-red-500 dark:text-red-400">
                {String(likeError)}
            </div>}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    PokAImon Gallery
                </h2>

                {/* ⏸️ WORKSHOP STEP 6: Add Sort and Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sort:
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="newest">Newest</option>
                            <option value="likes">Most Liked</option>
                            <option value="name">Name</option>
                        </select>
                    </div>

                    {/* Filter Dropdown */}
                    {availableTypes.size > 0 && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Type:
                            </label>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="all">All Types</option>
                                {Array.from(availableTypes).map((type) => type && (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {data.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                    No generated PokAImon yet. Head to the Generator!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedData.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex flex-col justify-between transition-colors border border-gray-100 dark:border-gray-700"
                        >
                            <div>
                                <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center p-2 mb-3">
                                    <img
                                        src={`${API}${pokemon.image_url.startsWith('/') ? '' : '/'}${pokemon.image_url}`}
                                        alt={pokemon.name}
                                        className="w-full h-full object-contain"
                                    />
                                </div>

                                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {pokemon.name}
                                    </h3>
                                    {pokemon.type && (
                                        <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                            {pokemon.type}
                                        </span>
                                    )}
                                </div>

                                {pokemon.characteristics && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">
                                        "{pokemon.characteristics}"
                                    </p>
                                )}

                                {pokemon.powers && Array.isArray(pokemon.powers) && pokemon.powers.length > 0 && (
                                    <div className="space-y-1 mt-2">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            Powers:
                                        </p>
                                        {pokemon.powers.map((power, idx) => (
                                            <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    {power.name}
                                                </span>
                                                {power.description && <span> - {power.description}</span>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => like(String(pokemon.id))}
                                disabled={likeLoading}
                                className="mt-4 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <span>❤️</span>
                                <span>Like ({pokemon.like_count || 0})</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GalleryPage;