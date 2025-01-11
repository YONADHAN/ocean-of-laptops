import React from "react";
import Table from "../../../components/MainComponents/Table";

const Wishlist = () => {
  const columns = [
    { label: "Item Name" },
    { label: "Cost" },
    { label: "Availability" },
    { label: "Actions" },
  ];

  const rows = [
    {
      id: 1,
      itemName: "HP Spectre X360 12th Gen Intel Core i7",
      cost: { original: "$5500", current: "$5000" },
      availability: "In Stock",
      image: "/placeholder.svg?height=64&width=96",
    },
    {
      id: 2,
      itemName: "HP Spectre X360 12th Gen Intel Core i5",
      cost: { original: "$5500", current: "$5000" },
      availability: "In Stock",
      image: "/placeholder.svg?height=64&width=96",
    },
    {
      id: 3,
      itemName: "HP Spectre X360 12th Gen Intel Core i9",
      cost: { original: "$5500", current: "$5000" },
      availability: "Out of Stock",
      image: "/placeholder.svg?height=64&width=96",
    },
  ];

  const handleAddToCart = (id) => alert(`Adding item with ID: ${id} to cart`);
  const handleRemove = (id) => alert(`Removing item with ID: ${id}`);

  return (
    <div>
      <div className="text-2xl font-bold mb-4">Wishlist</div>
      <Table
        columns={columns}
        rows={rows}
        renderHeader={(columns) => (
          <>
            <div className="p-4 text-left font-semibold">Product</div>
            <div className="p-4 text-right font-semibold">Price</div>
            <div className="p-4 text-center font-semibold">Availability</div>
            <div className="p-4 text-center font-semibold">Actions</div>
          </>
        )}
        renderRow={(rowData) => (
          <>
            <div className="flex items-center pl-5">
              <img
                src={rowData.image}
                alt={rowData.itemName}
                className="w-16 h-12 object-cover rounded-md mr-4 "
              />
              <span>{rowData.itemName}</span>
            </div>
            <div className="p-4 text-right">
              <div className="line-through text-gray-400">{rowData.cost.original}</div>
              <div className="text-gray-900 font-bold">{rowData.cost.current}</div>
            </div>
            <div className="p-4 text-center">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  rowData.availability === "In Stock"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {rowData.availability}
              </span>
            </div>
            <div className="p-4 flex justify-center gap-4">
              <button
                onClick={() => handleAddToCart(rowData.id)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  rowData.availability === "In Stock"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={rowData.availability !== "In Stock"}
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleRemove(rowData.id)}
                className="px-4 py-2 rounded-lg text-sm bg-red-100 hover:bg-red-200 text-red-600"
              >
                Remove
              </button>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default Wishlist;

