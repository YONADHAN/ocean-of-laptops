

import React from "react";

const Table = ({ columns, rows, renderHeader, renderRow }) => {
  const columnCount = columns.length;

  return (
    <div className="table-container border rounded overflow-hidden">
      {/* Header */}
      <div
        className={`header-row bg-gray-200 text-gray-900 font-medium grid`}
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {renderHeader
          ? renderHeader(columns)
          : columns.map((column, index) => (
              <div key={index} className="header-cell p-2 text-left">
                {column.label}
              </div>
            ))}
      </div>

      {/* Rows */}
      {rows.length > 0 ? (
        rows.map((row, index) => (
          <div
            key={row.id || row._id || index}
            className={`data-row grid border-t`}
            style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
          >
            {renderRow(row)}
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default Table;

