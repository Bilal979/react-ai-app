import { Link, NavLink } from "react-router-dom";

const Header = () => {
    return <>
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 transition-colors">

            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-4">

                <div className="text-xl font-bold text-gray-900 dark:text-white">
                    <Link to={'/'}>Doodle → PokAImon</Link>
                </div>

                <div className="flex items-center gap-4">
                    <nav className="flex gap-2">
                        <NavLink className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`} to={'/'}>Generator</NavLink>
                        <NavLink className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`} to={'/gallery'}>Gallery</NavLink>
                    </nav>
                </div>

            </div>


        </header>
    </>
};

export default Header;