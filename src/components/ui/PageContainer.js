const PageContainer = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);
