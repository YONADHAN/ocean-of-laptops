import React from 'react';
import { Search, Eye, Ban, X, Check, Edit, ArrowRightCircle } from 'lucide-react';

const Table = ({ 
  columns = [], 
  data = [], 
  searchable = true,
  onSearch = () => {},
}) => {
  // Action button styles based on action type
  const getActionStyles = (type) => {
    const styles = {
      view: "text-blue-600 hover:bg-blue-50",
      edit: "text-indigo-600 hover:bg-indigo-50",
      block: "text-red-600 hover:bg-red-50",
      unblock: "text-green-600 hover:bg-green-50",
      cancel: "text-gray-600 hover:bg-gray-50",
      approve: "text-emerald-600 hover:bg-emerald-50"
    };
    return styles[type] || styles.view;
  };

  // Get icon component based on action type
  const getActionIcon = (type) => {
    const icons = {
      view: Eye,
      edit: Edit,
      block: Ban,
      unblock: Check,
      cancel: X,
      approve: ArrowRightCircle
    };
    const IconComponent = icons[type];
    return IconComponent ? <IconComponent className="w-4 h-4 mr-1" /> : null;
  };

  if (!columns.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-4 text-center text-gray-500">
        No columns configured
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
      {searchable && (
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              onChange={(e) => onSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-sm font-medium text-gray-500 tracking-wider"
                >
                  {column.header || ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.type === 'image' && row[column.key] && (
                        <img 
                          src={row[column.key]} 
                          alt={row.name || 'item'} 
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      {column.type === 'status' && row[column.key] && (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          row[column.key]?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row[column.key]}
                        </span>
                      )}
                      {column.type === 'actions' && (
                        <div className="flex gap-2">
                          {(column.actions || []).map((action, actionIndex) => (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick?.(row)}
                              className={`px-3 py-1 text-sm rounded flex items-center ${getActionStyles(action.type)}`}
                            >
                              {getActionIcon(action.type)}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {(!column.type || column.type === 'text') && (row[column.key] || '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;