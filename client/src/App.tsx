import { Routes, Route } from "react-router-dom"
import Header from "./components/Header";
import GeneratorPage from "./pages/GeneratorPage";
import GalleryPage from "./pages/GalleryPage";

const App = () => {


    return <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
        <Header />
        <main className="flex-1 container mx-auto p-4 lg:p-8">
            <Routes>
                <Route path="/" element={<GeneratorPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
            </Routes>
        </main>
    </div>
};

export default App;