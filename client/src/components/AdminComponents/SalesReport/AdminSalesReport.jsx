

import React, { useState, useEffect } from "react";
import { IndianRupee, ShoppingBag, Percent, UsersRound } from "lucide-react";
import Pagination from "../../MainComponents/Pagination";
import { toast } from "sonner";
import { axiosInstance } from '../../../api/axiosConfig';

import jsPDF from "jspdf";
import "jspdf-autotable";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SalesReport = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState("thisYear");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalDiscounts: 0,
    totalCustomers: 0
  });
  const limit = 4;

  useEffect(() => {
    fetchOrders();
    fetchFullOrderDetails();
  }, [page, searchQuery, filterPeriod, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const payload = {
        page,
        limit,
        searchQuery,
        filterPeriod: startDate && endDate ? null : filterPeriod,
        startDate: startDate || null,
        endDate: endDate || null
      };

      const response = await axiosInstance.post('/admin/order_for_salesReport', payload);

      if (response.status === 200) {
        setData(response.data.orders);
        setTotalPages(response.data.pagination.totalPages);
        setMetrics(response.data.metrics);
        toast.success("Orders fetched successfully.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
      console.error("Fetch Error:", error);
    } 
  };

  const fetchFullOrderDetails = async () => {
    try {
         
      const payload = {     
        searchQuery,
        filterPeriod: startDate && endDate ? null : filterPeriod,
        startDate: startDate || null,
        endDate: endDate || null
      };
  
      const response = await axiosInstance.post('/admin/full_order_details_for_salesReport', payload)
  
      if (response.status === 200) {
        setAllData(response.data.orders);
        toast.success("Details of order for sales report fetched successfully.")
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  }
   
     
  const exportPDF = async () => {
    if (!allData.length) {
      toast.error("No data available to export.");
      return;
    }
  
    const doc = new jsPDF();
  
    const companyName = {
      text1: "Oceon",
      text2: "Of",
      text3: "Laptops"
    };
  
    doc.setFont("helvetica", "bold");
  
    const pageWidth = doc.internal.pageSize.width;
    const text1Width = doc.getStringUnitWidth(companyName.text1) * 24 / doc.internal.scaleFactor;
    const text2Width = doc.getStringUnitWidth(companyName.text2) * 24 / doc.internal.scaleFactor;
    const text3Width = doc.getStringUnitWidth(companyName.text3) * 24 / doc.internal.scaleFactor;
    const totalWidth = text1Width + text2Width + text3Width;
    const startX = (pageWidth - totalWidth) / 2;
  
    doc.setFontSize(24);
    let currentX = startX;
  
    doc.setTextColor(0, 122, 204);
    doc.text(companyName.text1, currentX, 20);
    currentX += text1Width;
  
    doc.setTextColor(0, 0, 0);
    doc.text(companyName.text2, currentX, 20);
    currentX += text2Width;
  
    doc.setTextColor(0, 122, 204);
    doc.text(companyName.text3, currentX, 20);
  
    doc.setDrawColor(0, 122, 204);
    doc.setLineWidth(0.5);
    doc.line(14, 25, pageWidth - 14, 25);
  
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Sales Report", 14, 35);
  
    if (startDate && endDate) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const periodText = `Period: ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`;
      doc.text(periodText, 14, 42);
    }
  
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 45, 180, 50, 'F');
  
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, 55);
  
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  
    const leftColumnMetrics = [
      { label: "Total Sales", value: `₹${metrics.totalSales.toLocaleString()}` },
      { label: "Total Orders", value: metrics.totalOrders.toLocaleString() }
    ];
  
    const rightColumnMetrics = [
      { label: "Total Offer Discounts", value: `₹${metrics.totalDiscounts.toLocaleString()}` },
      { label: "Total Coupon Discounts", value: `₹${metrics.couponDiscounts.toLocaleString()}` }
    ];
  
    leftColumnMetrics.forEach((metric, index) => {
      doc.text(metric.label + ":", 20, 65 + (index * 10));
      doc.setFont("helvetica", "bold");
      doc.text(metric.value.replace(/¹/g, ""), 70, 65 + (index * 10));
      doc.setFont("helvetica", "normal");
    });
  
    rightColumnMetrics.forEach((metric, index) => {
      doc.text(metric.label + ":", 100, 65 + (index * 10));
      doc.setFont("helvetica", "bold");
      doc.text(metric.value.replace(/¹/g, ""), 150, 65 + (index * 10));
      doc.setFont("helvetica", "normal");
    });
  
    doc.text("Total Customers:", 20, 85);
    doc.setFont("helvetica", "bold");
    doc.text(metrics.totalCustomers.toLocaleString().replace(/¹/g, ""), 70, 85);
  
    // Add Serial Number column to the table
    const columns = [
      { header: "S. No", dataKey: "serialNumber", width: 10 }, // New Serial Number column
      { header: "Order ID", dataKey: "orderId", width: 30 },
      { header: "Customer Name", dataKey: "customerName", width: 20 },
      { header: "Regular Price", dataKey: "regularPrice", width: 16 },
      { header: "Sales Price", dataKey: "salesPrice", width: 16 },
      { header: "Total Amount", dataKey: "totalAmount", width: 16 },
      { header: "Offer", dataKey: "offer", width: 16 },
      { header: "Coupon Discount", dataKey: "couponDiscount", width: 14 },
      { header: "Placed At", dataKey: "placedAt", width: 20 }
    ];
  
    const rows = allData.map((row, index) => ({
      serialNumber: index + 1, // Add serial number
      orderId: row.orderId,
      customerName: row.shippingAddress?.name || "N/A",
      regularPrice: `₹${(row.orderedAmount + (row.totalDiscount || 0) - 15).toFixed(0).replace(/¹/g, "")}`,
      salesPrice: `₹${row.orderedAmount.toFixed(0).replace(/¹/g, "")}`,
      totalAmount: `₹${row.totalAmount.toFixed(0).replace(/¹/g, "")}`,
      offer: `₹${row.totalDiscount.toFixed(0).replace(/¹/g, "")}`,
      couponDiscount: `₹${(row.couponDiscount || 0).toFixed(0).replace(/¹/g, "")}`,
      placedAt: new Date(row.placedAt).toLocaleString()
    }));
  
    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 105,
      columnStyles: {
        serialNumber: { cellWidth: 10 },
        orderId: { cellWidth: 30 },
        customerName: { cellWidth: 20 },
        regularPrice: { cellWidth: 20 },
        salesPrice: { cellWidth: 20 },
        totalAmount: { cellWidth: 20 },
        offer: { cellWidth: 20 },
        couponDiscount: { cellWidth: 20 },
        placedAt: { cellWidth: 20 }
      },
      headStyles: {
        fillColor: [0, 122, 204],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 6,
        textColor: 50,
        lineWidth: 0.1
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 105 }
    });
  
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  
    doc.save("OceonOfLaptops_SalesReport.pdf");
    toast.success("PDF file exported successfully.");
  };
  
// const exportExcel = async () => {
  
//   if (!allData.length) {
//       toast.error("No data available to export.");
//       return;
//     }
  
//     // Map data to export format
//     const exportData = allData.map((row) => ({
//       OrderID: row.orderId,
//       CustomerName: row.shippingAddress?.name || "N/A",
//       RegularPrice: row.orderedAmount + (row.totalDiscount || 0) - 15,
//       SalesPrice: row.orderedAmount,
//       TotalAmount: row.totalAmount,
//       Offer: row.totalDiscount,
//       CouponDiscount: row.couponDiscount,
//       PlacedAt: new Date(row.placedAt).toLocaleString(),
//     }));
  
//     // Create a new workbook and worksheet
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
  
//     // Generate Excel file and prompt download
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, "SalesReport.xlsx");
  
//     toast.success("Excel file exported successfully.");
// }

const exportExcel = async () => {
  if (!allData.length) {
    toast.error("No data available to export.");
    return;
  }

  // Prepare summary data
  const summaryData = [
    ["Metric", "Value"],
    ["Total Sales", metrics.totalSales],
    ["Total Orders", metrics.totalOrders],
    ["Total Coupon Discounts", metrics.couponDiscounts],
    ["Total Offer Discounts", metrics.totalDiscounts],
    ["Total Customers", metrics.totalCustomers],
  ];

  // Map order data to export format
  const exportData = allData.map((row) => ({
    OrderID: row.orderId,
    CustomerName: row.shippingAddress?.name || "N/A",
    RegularPrice: row.orderedAmount + (row.totalDiscount || 0) - 15,
    SalesPrice: row.orderedAmount,
    TotalAmount: row.totalAmount,
    Offer: row.totalDiscount,
    CouponDiscount: row.couponDiscount,
    PlacedAt: new Date(row.placedAt).toLocaleString(),
  }));

  // Create a new workbook and add both sheets
  const workbook = XLSX.utils.book_new();

  // Create summary worksheet
  const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");

  // Create order details worksheet
  const orderDetailsWorksheet = XLSX.utils.json_to_sheet(exportData);
  XLSX.utils.book_append_sheet(workbook, orderDetailsWorksheet, "Sales Report");

  // Generate Excel file and download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "SalesReport.xlsx");

  toast.success("Excel file exported successfully.");
};



const formatCurrency = (amount) => {
    return `₹${amount}`;
  };

  const columns = [
    { label: "Order ID", key: "orderId" },
    { label: "Customer Name", key: "shippingAddress.name" },
    { label: "Regular Price", key: "regularPrice" },
    { label: "Sales Price", key: "orderedAmount" },
    { label: "Total Amount", key: "totalAmount" },
    { label: "Offer", key: "totalDiscount" },
    { label: "Coupon Discount", key: "couponDiscount" },
    { label: "Placed At", key: "placedAt" },
  ];

  const renderRow = (row) => {
    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    return (
      <>
        {/* Mobile View */}
        <div className="md:hidden col-span-5 p-4 border-b space-y-4 text-[10px]">
          {columns.map((column) => (
            <div key={column.key} className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{column.label}:</span>
              <span className="text-right">
                {column.key === "placedAt"
                  ? formatDate(row.placedAt)
                  : column.key === "regularPrice"
                  ? formatCurrency((row.orderedAmount || 0) + (row.totalDiscount || 0) - 15)
                  : column.key === "totalAmount" || column.key === "orderedAmount"
                  ? formatCurrency(
                      column.key.split(".").reduce((acc, key) => acc[key] || "", row)
                    )
                  : column.key.split(".").reduce((acc, key) => acc[key] || "", row)}
              </span>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        {columns.map((column) => (
          <div key={column.key} className="hidden md:block p-4 text-[10px]">
            {column.key === "placedAt"
              ? formatDate(row.placedAt)
              : column.key === "regularPrice"
              ? formatCurrency((row.orderedAmount || 0) + (row.totalDiscount || 0) - 15)
              : column.key === "totalAmount" || column.key === "orderedAmount"
              ? formatCurrency(
                  column.key.split(".").reduce((acc, key) => acc[key] || "", row)
                )
              : column.key.split(".").reduce((acc, key) => acc[key] || "", row)}
          </div>
        ))}
      </>
    );
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    if (value) setFilterPeriod("");
  };

  const handleFilterPeriodChange = (e) => {
    setFilterPeriod(e.target.value);
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Sales Report</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 ease-in-out" onClick = {exportPDF}>
              Export PDF
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out" onClick ={exportExcel}>
              Export Excel
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <IndianRupee size={24} className="text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(metrics.totalSales)}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <ShoppingBag size={24} className="text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-lg font-bold text-gray-800">{metrics.totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <Percent size={24} className="text-red-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Offers</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(metrics.totalDiscounts)}</p>
            </div>            
          </div>
          <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm">
            <Percent size={24} className="text-orange-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600"> Coupon Discounts</p>
              <p className="text-lg font-bold text-gray-800"> {formatCurrency(metrics.couponDiscounts)}</p>
            </div>            
          </div>
         
          <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <UsersRound size={24} className="text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-lg font-bold text-gray-800">{metrics.totalCustomers}</p>
            </div>
          </div>
        </section>

        {/* Filtering Options */}
        <section className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <select 
              value={filterPeriod}
              onChange={handleFilterPeriodChange}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="thisYear">This Year</option>
              <option value="thisMonth">This Month</option>
              <option value="thisWeek">This Week</option>
              <option value="thisDay">This Day</option>
            </select>
          </div>
          <div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID or customer"
              className="border-blue-500 min-w-80 px-5 border rounded-lg outline-none h-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full sm:w-auto">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="hidden md:grid grid-cols-8 bg-gray-100 p-4 font-medium text-gray-700">
            {columns.map((column) => (
              <div key={column.key} className="px-2">
                {column.label}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center p-4 text-gray-500">Loading...</div>
          ) : data.length > 0 ? (
            data.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-8 border-b hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                {renderRow(row)}
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-gray-500">No data available</div>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};

export default SalesReport;
