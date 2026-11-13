import { createContext, useContext, useState, type ReactNode } from "react";

interface ApiKeyContextType {
    apiKey: string;
    updateApiKey: (newKey: string) => void;
    clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
    const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || '');

    const updateApiKey = (newKey: string) => {
        setApiKey(newKey);
        localStorage.setItem('GEMINI_API_KEY', newKey);
    }

    const clearApiKey = () => {
        setApiKey('');
        localStorage.setItem('GEMINI_API_KEY', '');
    }
    return <ApiKeyContext.Provider value={{ apiKey, updateApiKey, clearApiKey }}>{children}</ApiKeyContext.Provider>
}

const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error("useApiKey must be inside a provider");
    }
    return context;
}
export { useApiKey }
export default ApiKeyProvider;