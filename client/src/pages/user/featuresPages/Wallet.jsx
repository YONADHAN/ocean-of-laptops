// import React, { useState, useEffect } from "react";
// import Table from "../../../components/MainComponents/Table";
// import Pagination from "../../../components/MainComponents/Pagination";
// import ConfirmationAlert from "../../../components/MainComponents/ConformationAlert";
// import { Wallet } from "lucide-react";
// import { axiosInstance } from "../../../api/axiosConfig";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { toast } from "sonner";

// const Modal = ({ isOpen, onClose, title, children }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// };

// const WalletComponent = () => {
//   const [walletData, setWalletData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userId, setUserId] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
//   const [showConfirmAlert, setShowConfirmAlert] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const itemsPerPage = 3;

//   const fetchWalletData = async (page) => {
//     setIsLoading(true);
//     try {
//       const token = Cookies.get("access_token");
//       if (!token) {
//         toast.error("Authentication token not found, please try to login again.");
//         return;
//       }
      
//       const decoded = jwtDecode(token);
//       const userId = decoded._id;
//       setUserId(userId);
      
//       const data = {
//         userId,
//         page,
//         limit: itemsPerPage,
//       };
      
//       const response = await axiosInstance.post("/get_wallet_history", data);
      
//       if (!response.data.wallet) {
//         toast.error("Wallet not found");
//         return;
//       }

//       setWalletData(response.data.wallet);
//       setTransactions(response.data.wallet.transactions);
//       setTotalTransactions(response.data.totalTransactions);
      
//     } catch (error) {
//       console.error("Error fetching wallet data:", error);
//       toast.error("Failed to fetch wallet data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchWalletData(currentPage);
//   }, [currentPage]);

 

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const inputAmount = parseFloat(amount);
    
//     if (isNaN(inputAmount) || inputAmount <= 0) {
//       toast.error("Please enter a valid amount");
//       return;
//     }
    
//     setShowAddMoneyModal(false);
//     setShowConfirmAlert(true);
//   };

//   const handleConfirmSubmit = async () => {
//     try {
//       const response = await axiosInstance.post('/add_to_wallet', {
//         userId,
//         amount: parseFloat(amount),
//         transactionType: 'credit',
//         description: "Money added from Wallet"
//       });

//       if (!response.data.wallet) {
//         toast.error("You have an empty Wallet. Add Money to your wallet.");
//         return;
//       }

//       setWalletData(response.data.wallet);
//       toast.success("Money added to wallet successfully");
//       setShowConfirmAlert(false);
//       setAmount("");
//       fetchWalletData(currentPage); 
//     } catch (error) {
//       console.error("Error adding money to wallet:", error);
//       toast.error("Failed to add money to wallet");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const columns = [
//     { label: "Type", key: "type" },
//     { label: "Description", key: "description" },
//     { label: "Date", key: "date" },
//     { label: "Amount", key: "amount" },
//   ];

//   const rows = transactions.map((transaction) => ({
//     type: transaction.type,
//     description: transaction.description,
//     date: new Date(transaction.date).toLocaleDateString(),
//     amount: `₹${transaction.amount.toFixed(2)}`,
//   })) || [];

//   const renderHeader = (columns) => (
//     <>
//       {columns.map((col) => (
//         <div
//           key={col.key}
//           className="hidden md:block p-2 text-left font-medium"
//         >
//           {col.label}
//         </div>
//       ))}
//     </>
//   );

//   const renderRow = (row) => {
//     return (
//       <>
//         {/* Mobile View */}
//         <div className="md:hidden col-span-4 space-y-3 p-4 border-b">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-600">Type:</span>
//             <span className="text-sm">{row.type}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-600">Description:</span>
//             <span className="text-sm text-right">{row.description}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-600">Date:</span>
//             <span className="text-sm">{row.date}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-gray-600">Amount:</span>
//             <span className="text-sm">{row.amount}</span>
//           </div>
//         </div>

//         {/* Desktop View */}
//         {columns.map((col) => (
//           <div
//             key={col.key}
//             className="hidden md:block p-4 text-sm text-gray-900"
//           >
//             {row[col.key]}
//           </div>
//         ))}
//       </>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <div className="flex items-center justify-between mb-8 p-4 border-b">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-gray-100 rounded-lg">
//             <Wallet className="w-6 h-6 text-gray-600" />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold">
//               ₹{walletData?.balance?.toFixed(2) || "0.00"}
//             </h2>
//             <p className="text-gray-600">My Wallet Balance</p>
//           </div>
//         </div>
       
//       </div>

//       <h3 className="text-lg font-semibold mb-4">TRANSACTION DETAILS</h3>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       ) : (
//         <>
//           <Table
//             columns={columns}
//             rows={rows}
//             renderHeader={renderHeader}
//             renderRow={renderRow}
//           />
//           <Pagination
//             currentPage={currentPage}
//             totalPages={Math.ceil(totalTransactions / itemsPerPage)}
//             onPageChange={handlePageChange}
//           />
//         </>
//       )}

     
//       <ConfirmationAlert
//         show={showConfirmAlert}
//         title="Confirm Add Money To Wallet"
//         message={`Are you sure you want to add ₹${parseFloat(amount).toFixed(2)} to your wallet?`}
//         onCancel={() => setShowConfirmAlert(false)}
//         onProceed={handleConfirmSubmit}
//         noText="Cancel"
//         yesText="Confirm"
//       />
//     </div>
//   );
// };

// export default WalletComponent;


"use client"

import { useState, useEffect, useCallback } from "react"
import Table from "../../../components/MainComponents/Table"
import Pagination from "../../../components/MainComponents/Pagination"
import ConfirmationAlert from "../../../components/MainComponents/ConformationAlert"
import { Wallet } from "lucide-react"
import { axiosInstance } from "../../../api/axiosConfig"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-blue-900 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-800">{title}</h2>
          <button onClick={onClose} className="text-blue-500 hover:text-blue-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const WalletComponent = () => {
  const [walletData, setWalletData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [amount, setAmount] = useState("")
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [showConfirmAlert, setShowConfirmAlert] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [transactions, setTransactions] = useState([])
  const itemsPerPage = 3

  // Move fetchWalletData to useCallback to prevent recreation on every render
  const fetchWalletData = useCallback(async (page) => {
    setIsLoading(true)
    try {
      const token = Cookies.get("access_token")
      if (!token) {
        toast.error("Authentication token not found, please try to login again.")
        return
      }

      const decoded = jwtDecode(token)
      const currentUserId = decoded._id
      setUserId(currentUserId)

      const response = await axiosInstance.post("/get_wallet_history", {
        userId: currentUserId,
        page,
        limit: itemsPerPage,
      })

      if (!response.data.wallet) {
        toast.error("Wallet not found")
        return
      }

      setWalletData(response.data.wallet)
      setTransactions(response.data.wallet.transactions)
      setTotalTransactions(response.data.totalTransactions)
    } catch (error) {
      //console.error("Error fetching wallet data:", error)
      toast.info("Nothing is there in the wallet")
    } finally {
      setIsLoading(false)
    }
  }, []) // Empty dependency array since it doesn't depend on any props or state

  useEffect(() => {
    fetchWalletData(currentPage)
  }, [currentPage, fetchWalletData])

  const handleSubmit = (e) => {
    e.preventDefault()
    const inputAmount = Number.parseFloat(amount)

    if (isNaN(inputAmount) || inputAmount <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setShowAddMoneyModal(false)
    setShowConfirmAlert(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      const response = await axiosInstance.post("/add_to_wallet", {
        userId,
        amount: Number.parseFloat(amount),
        transactionType: "credit",
        description: "Money added from Wallet",
      })

      if (!response.data.wallet) {
        toast.error("You have an empty Wallet. Add Money to your wallet.")
        return
      }

      setWalletData(response.data.wallet)
      toast.success("Money added to wallet successfully")
      setShowConfirmAlert(false)
      setAmount("")
      fetchWalletData(currentPage)
    } catch (error) {
      console.error("Error adding money to wallet:", error)
      toast.error("Failed to add money to wallet")
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const columns = [
    { label: "Type", key: "type" },
    { label: "Description", key: "description" },
    { label: "Date", key: "date" },
    { label: "Amount", key: "amount" },
  ]

  const rows = transactions.map((transaction) => ({
    type: transaction.type,
    description: transaction.description,
    date: new Date(transaction.date).toLocaleDateString(),
    amount: `₹${transaction.amount.toFixed(2)}`,
  }))

  const renderHeader = useCallback((columns) => (
    <>
      {columns.map((col) => (
        <div key={col.key} className="hidden md:block p-2 text-left font-medium text-white bg-blue-600">
          {col.label}
        </div>
      ))}
    </>
  ), [])

  const renderRow = useCallback((row) => {
    return (
      <>
        {/* Mobile View */}
        <div className="md:hidden col-span-4 space-y-3 p-4 border-b border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">Type:</span>
            <span className="text-sm">{row.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">Description:</span>
            <span className="text-sm text-right">{row.description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">Date:</span>
            <span className="text-sm">{row.date}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-600">Amount:</span>
            <span className="text-sm">{row.amount}</span>
          </div>
        </div>

        {/* Desktop View */}
        {columns.map((col) => (
          <div key={col.key} className="hidden md:block p-4 text-sm text-blue-900">
            {row[col.key]}
          </div>
        ))}
      </>
    )
  }, [columns])

  return (
    <div className="max-w-6xl mx-auto p-6 bg-blue-50 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8 p-4 border-b border-blue-200">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-blue-800">₹{walletData?.balance?.toFixed(2) || "0.00"}</h2>
            <p className="text-blue-600">My Wallet Balance</p>
          </div>
        </div>
        {/* <button
          onClick={() => setShowAddMoneyModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Money
        </button> */}
      </div>

      <h3 className="text-lg font-semibold mb-4 text-blue-800">TRANSACTION DETAILS</h3>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <Table 
            columns={columns} 
            rows={rows} 
            renderHeader={renderHeader} 
            renderRow={renderRow} 
          />
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalTransactions / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <Modal isOpen={showAddMoneyModal} onClose={() => setShowAddMoneyModal(false)} title="Add Money to Wallet">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-blue-700">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Money
          </button>
        </form>
      </Modal>

      <ConfirmationAlert
        show={showConfirmAlert}
        title="Confirm Add Money To Wallet"
        message={`Are you sure you want to add ₹${Number.parseFloat(amount).toFixed(2)} to your wallet?`}
        onCancel={() => setShowConfirmAlert(false)}
        onProceed={handleConfirmSubmit}
        noText="Cancel"
        yesText="Confirm"
      />
    </div>
  )
}

export default WalletComponent