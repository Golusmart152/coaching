const NavButton = ({ targetPage, children, page, setPage }) => (
    <button
        onClick={() => setPage(targetPage)}
        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            page === targetPage ? 'bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
    >
        {children}
    </button>
);
