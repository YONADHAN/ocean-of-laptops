

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
//--------------------------------------------------------------------------------------------




// import React from "react";

// const Table = ({ columns, rows, renderHeader, renderRow }) => {
//   const columnCount = columns.length;

//   return (
//     <div className="overflow-x-auto">
//       <div className="table-container border rounded overflow-hidden min-w-full">
//         {/* Header */}
//         <div className="hidden md:block">
//           <div
//             className={`header-row bg-gray-200 text-gray-900 font-medium grid`}
//             style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
//           >
//             {renderHeader
//               ? renderHeader(columns)
//               : columns.map((column, index) => (
//                   <div key={index} className="header-cell p-2 text-left">
//                     {column.label}
//                   </div>
//                 ))}
//           </div>
//         </div>

//         {/* Rows */}
//         {rows.length > 0 ? (
//           rows.map((row, rowIndex) => (
//             <div
//               key={row.id || row._id || rowIndex}
//               className="data-row border-t"
//             >
//               <div className="md:hidden">
//                 {columns.map((column, colIndex) => (
//                   <div key={colIndex} className="p-2 flex justify-between">
//                     <div className="font-medium">{column.label}:</div>
//                     <div>{renderRow(row)[colIndex]}</div>
//                   </div>
//                 ))}
//               </div>
//               <div
//                 className="hidden md:grid"
//                 style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
//               >
//                 {renderRow(row)}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="p-4 text-center text-gray-500">No data available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Table;





// import React from "react";

// const Table = ({ columns, rows, renderRow }) => {
//   const columnCount = columns.length;
//   return (
//     <div className="overflow-x-auto">
//       <div className="min-w-full border rounded overflow-hidden">
//         {/* Header - visible only on desktop */}
//         <div className="hidden md:grid md:grid-cols-6 bg-gray-200 text-gray-900 font-medium">
//           {columns.map((column, index) => (
//             <div key={index} className="p-2 text-left">
//               {column.label}
//             </div>
//           ))}
//         </div>

//         {/* Rows */}
//         {rows.length > 0 ? (
//           rows.map((row, rowIndex) => (
//             <div
//               key={row.id || row._id || rowIndex}
//               className="border-t"
//             >
//               {renderRow(row)}
//             </div>
//           ))
//         ) : (
//           <div className="p-4 text-center text-gray-500">No data available</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Table;

