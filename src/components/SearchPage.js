const SearchPage = ({ searchQuery, showMessage, navigateTo }) => {
    const { useState, useEffect } = React;
    const [query, setQuery] = useState(searchQuery || '');
    
    // Sync internal query state with prop changes (for URL navigation)
    useEffect(() => {
        setQuery(searchQuery || '');
    }, [searchQuery]);
    const [filters, setFilters] = useState([]);
    const [results, setResults] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    
    // Use the search hook
    const { searchAllData } = useSearchData();
    
    // Available filter options
    const filterOptions = [
        { id: 'students', label: 'Students', icon: '👨‍🎓' },
        { id: 'employees', label: 'Employees', icon: '👥' },
        { id: 'enquiries', label: 'Enquiries', icon: '📝' },
        { id: 'fees', label: 'Fee Transactions', icon: '💰' },
        { id: 'salaries', label: 'Salary Transactions', icon: '💳' },
        { id: 'courses', label: 'Courses', icon: '📚' },
        { id: 'exams', label: 'Exams', icon: '📋' },
        { id: 'results', label: 'Results', icon: '🎯' }
    ];

    useEffect(() => {
        if (query.trim()) {
            const searchResults = searchAllData(query, filters);
            setResults(searchResults);
            
            // Auto-expand sections with results
            const newExpanded = {};
            Object.keys(searchResults).forEach(key => {
                if (searchResults[key] && searchResults[key].length > 0) {
                    newExpanded[key] = true;
                }
            });
            setExpandedSections(newExpanded);
        } else {
            setResults({});
            setExpandedSections({});
        }
    }, [query, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigateTo('/search', query);
        }
    };

    const toggleFilter = (filterId) => {
        setFilters(prev => 
            prev.includes(filterId) 
                ? prev.filter(f => f !== filterId)
                : [...prev, filterId]
        );
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const showDetails = (item, type) => {
        setSelectedItem({ ...item, type });
        setShowDetailModal(true);
    };

    const getResultCount = () => {
        return Object.values(results).reduce((total, items) => total + (items?.length || 0), 0);
    };

    const renderResultCard = (item, type) => {
        let title, subtitle, details;
        
        switch(type) {
            case 'students':
                title = `${item.firstName} ${item.lastName}`;
                subtitle = `ID: ${item.studentId} | Course: ${item.course}`;
                details = `${item.email} | ${item.phone}`;
                break;
            case 'employees':
                title = `${item.firstName} ${item.lastName}`;
                subtitle = `Role: ${item.role}`;
                details = `${item.email} | ${item.phone}`;
                break;
            case 'enquiries':
                title = item.name;
                subtitle = `Course: ${item.courseEnquired} | Status: ${item.status}`;
                details = `${item.phone}`;
                break;
            case 'fees':
                title = `Fee Payment - Student ID: ${item.studentId}`;
                subtitle = `Amount: ₹${item.amountPaid} | Date: ${item.date}`;
                details = `Method: ${item.paymentMethod} | Type: ${item.paymentType}`;
                break;
            case 'salaries':
                title = `Salary Payment - Employee ID: ${item.employeeId}`;
                subtitle = `Amount: ₹${item.amountPaid} | Date: ${item.date}`;
                details = `Method: ${item.paymentMethod} | Transaction ID: ${item.transactionId || 'N/A'}`;
                break;
            case 'courses':
                title = item.name;
                subtitle = `Duration: ${item.duration || 'N/A'} | Instructor: ${item.instructor || 'N/A'}`;
                details = item.description || 'No description available';
                break;
            case 'exams':
                title = `${item.subjectName} - ${item.topic}`;
                subtitle = `Date: ${item.date} | Time: ${item.time}`;
                details = `Duration: ${item.duration}h | Location: ${item.location}`;
                break;
            case 'results':
                title = `Result - Student ID: ${item.studentId}`;
                subtitle = `Exam ID: ${item.examId} | Score: ${item.score}`;
                details = `Student ID: ${item.studentId} | Exam ID: ${item.examId}`;
                break;
            default:
                title = 'Unknown Item';
                subtitle = '';
                details = '';
        }

        return (
            <div 
                key={item.id} 
                onClick={() => showDetails(item, type)}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200"
            >
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 mb-1">{subtitle}</p>
                <p className="text-xs text-gray-500">{details}</p>
            </div>
        );
    };

    const renderSection = (sectionKey, items, sectionInfo) => {
        if (!items || items.length === 0) return null;

        return (
            <div key={sectionKey} className="mb-6">
                <div 
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center justify-between bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300 mb-4"
                >
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">{sectionInfo.icon}</span>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{sectionInfo.label}</h2>
                            <p className="text-sm text-gray-600">{items.length} result{items.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <svg 
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                
                {expandedSections[sectionKey] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                        {items.map(item => renderResultCard(item, sectionKey))}
                    </div>
                )}
            </div>
        );
    };

    const renderDetailModal = () => {
        if (!selectedItem || !showDetailModal) return null;

        const { type, ...item } = selectedItem;
        
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {filterOptions.find(f => f.id === type)?.label} Details
                            </h2>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(item).map(([key, value]) => {
                                if (key === 'type' || key === 'password') return null;
                                return (
                                    <div key={key} className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PageContainer title="Search Results">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search students, employees, transactions, courses..."
                            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map(option => (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleFilter(option.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                                filters.includes(option.id)
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {option.icon} {option.label}
                        </button>
                    ))}
                </div>
            </form>

            {/* Results Summary */}
            {query.trim() && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-blue-800">
                        Found <strong>{getResultCount()}</strong> result{getResultCount() !== 1 ? 's' : ''} for "<strong>{query}</strong>"
                        {filters.length > 0 && ` in ${filters.length} selected module${filters.length !== 1 ? 's' : ''}`}
                    </p>
                </div>
            )}

            {/* Results */}
            {Object.keys(results).length > 0 ? (
                <div>
                    {filterOptions.map(option => 
                        renderSection(option.id, results[option.id], option)
                    )}
                </div>
            ) : query.trim() ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or filters</p>
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
                    <p className="text-gray-600">Enter a search term to find students, employees, transactions, and more</p>
                </div>
            )}

            {renderDetailModal()}
        </PageContainer>
    );
};