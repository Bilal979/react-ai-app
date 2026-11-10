import { useCallback, useEffect, useState } from "react";
import type { APIResponse, PokAImon } from "../types";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const usePokemonGallery = () => {
    const [data, setData] = useState<PokAImon[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGallery = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const url = `${API}/api/gallery`;
            const resp = await axios.get<APIResponse<PokAImon[]>>(url);

            setData(resp.data.data);
        } catch (e) {
            setError('Could not fetch gallery data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGallery()
    }, [fetchGallery]);

    return { data, loading, error, refetch: fetchGallery }

}


export default usePokemonGallery;