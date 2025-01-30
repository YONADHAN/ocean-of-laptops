import React from "react";

const ConfirmationAlert = ({ 
  show, 
  title, 
  message, 
  onCancel, 
  onProceed, 
  noText = "No", 
  yesText = "Yes" 
}) => {
  if (!show) return null; 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        <div className="text-gray-600 mt-2">{message}</div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            {noText}
          </button>
          <button
            onClick={onProceed}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
          >
            {yesText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationAlert;





// import React, { useState } from "react";
// import ConfirmationAlert from "./ConfirmationAlert";

// const App = () => {
//   const [showAlert, setShowAlert] = useState(false);

//   const handleCancel = () => {
//     console.log("Process canceled!");
//     setShowAlert(false);
//   };

//   const handleProceed = () => {
//     console.log("Process proceeded!");
//     setShowAlert(false);
//   };

//   return (
//     <div className="p-4">
//       <button
//         onClick={() => setShowAlert(true)}
//         className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//       >
//         Show Alert
//       </button>
//       <ConfirmationAlert
//         show={showAlert}
//         title="Are you sure?"
//         message="Do you want to proceed with this action?"
//         onCancel={handleCancel}
//         onProceed={handleProceed}
//         noText="Cancel"
//         yesText="Confirm"
//       />
//     </div>
//   );
// };

// export default App;
