import React from "react";

const ReasonMessageBox = ({ 
  title = "Provide Your Reason", 
  onSubmit, 
  onClose, 
  submitKey = "Submit", 
  closeKey = "Cancel",
  placeholder = "Enter your reason here...",
}) => {
  const [reason, setReason] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reason); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full h-28 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              {closeKey}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              {submitKey}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReasonMessageBox;
