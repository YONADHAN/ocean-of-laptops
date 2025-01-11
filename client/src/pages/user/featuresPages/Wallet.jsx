import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Wallet } from 'lucide-react';

const transactions = [
  { id: '#96459761', description: 'Return', date: 'Dec 30, 2023', amount: '$500' },
  { id: '#96459760', description: 'You Added', date: 'Dec 30, 2023', amount: '$500' },
  { id: '#96459759', description: 'Bought a product', date: 'Dec 30, 2023', amount: '$500' },
  { id: '#96459758', description: 'You added', date: 'Dec 30, 2023', amount: '$500' },
  { id: '#96459757', description: 'You added', date: 'Dec 30, 2023', amount: '$500' },
  { id: '#96459756', description: 'You added', date: 'Dec 30, 2023', amount: '$500' },
];

const WalletComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Wallet Balance Section */}
      <div className="flex items-center justify-between mb-8 p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <Wallet className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">$500</h2>
            <p className="text-gray-600">My Wallet Balance</p>
          </div>
        </div>
        <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
          Add Money
        </button>
      </div>

      {/* Transaction Details Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">TRANSACTION DETAILS</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">TRANSACTION ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">DESCRIPTION</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">DATE</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">DEPOSIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`w-8 h-8 rounded-full ${
              currentPage === index + 1
                ? 'bg-gray-200'
                : 'hover:bg-gray-100'
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default WalletComponent;