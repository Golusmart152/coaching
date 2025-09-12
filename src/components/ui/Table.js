const Table = ({ data, columns }) => (
    <div className="overflow-x-auto rounded-lg shadow-inner">
        <table className="min-w-full bg-white border-collapse">
            <thead className="bg-gray-800 text-white">
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} className="px-4 py-3 text-left font-medium border-b border-gray-600 rounded-lg">
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-3">
                                    {col.render ? col.render(item) : item[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                            No data available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
