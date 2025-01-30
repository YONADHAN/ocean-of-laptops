

import React, { useState, useEffect } from "react";
import Table from "../../../components/MainComponents/Table";
import { wishlistService, cartService } from "../../../apiServices/userApiServices";
import { toast } from "sonner";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import Pagination from "../../../components/MainComponents/Pagination";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 4;

    const fetchWishlist = async (page) => {
        setIsLoading(true);
        try {
            const token = Cookies.get("access_token");
            if (!token) throw new Error("Authentication token not found");

            const decoded = jwtDecode(token);
            const userId = decoded._id;

            const response = await wishlistService.getWishlists({ userId, page, limit: itemsPerPage });
            if (!response || !response.data) {
                toast.error("Failed to fetch wishlist.");
                return;
            }

            setWishlist(response.data.wishlists);
            setTotalPages(Math.ceil(response.data.totalProducts / itemsPerPage));
        } catch (error) {
            console.error(error.message);
            toast.error(error.response?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist(currentPage);
    }, [currentPage]);

    const handleAddToCart = async (id) => {
        try {
            const response = await cartService.addToCart(id, 1);
            if (response.status === 200) {
                toast.success("Product added to cart");
                handleRemove(id);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding to cart");
            console.error(error);
        }
    };

    const handleRemove = async (id) => {
        try {
            const token = Cookies.get("access_token");
            const decoded = jwtDecode(token);
            const userId = decoded._id;

            const response = await wishlistService.removeFromWishlist(userId, id);
            if (response.status === 200) {
                toast.success("Product removed from wishlist");
                fetchWishlist(currentPage);
            }
        } catch (error) {
            toast.error("Error while removing product");
            console.error(error);
        }
    };

    const columns = [
        { label: "Product", key: "product" },
        { label: "Price", key: "price" },
        { label: "Availability", key: "availability" },
        { label: "Actions", key: "actions" },
    ];

    const rows = Array.isArray(wishlist)
        ? wishlist.map((item) => ({
              id: item.productId._id || item.productId,
              itemName: item.productId.productName || "Unknown Product",
              cost: {
                  original: `₹${item.productId.regularPrice}`,
                  current: ` ₹${item.productId.salePrice}`,
              },
              availability: item.productId.quantity > 0 ? "In Stock" : "Out of Stock",
              image: item.productId.productImage?.[0] || "/placeholder.svg?height=64&width=96",
          }))
        : [];

    const renderHeader = (columns) =>
        columns.map((col) => (
            <div key={col.key} className="hidden md:block p-4 font-semibold text-left">
                {col.label}
            </div>
        ));

    const renderRow = (row) => {
        const renderContent = (key) => {
            switch (key) {
                case "product":
                    return (
                        <div className="flex items-center">
                            <img src={row.image} alt={row.itemName} className="w-12 h-12 mr-4 rounded-md" />
                            <span>{row.itemName}</span>
                        </div>
                    );
                case "price":
                    return (
                        <div>
                            <div className="line-through text-gray-400">{row.cost.original}</div>
                            <div className="text-gray-900 font-bold">{row.cost.current}</div>
                        </div>
                    );
                case "availability":
                    return (
                        <span
                            className={`px-3 py-1 text-sm rounded-full ${
                                row.availability === "In Stock" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            }`}
                        >
                            {row.availability}
                        </span>
                    );
                case "actions":
                    return (
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAddToCart(row.id)}
                                className={`px-4 py-2 rounded-lg text-sm ${
                                    row.availability === "In Stock"
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={row.availability !== "In Stock"}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => handleRemove(row.id)}
                                className="px-4 py-2 rounded-lg text-sm bg-red-100 hover:bg-red-200 text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <>
                <div className="md:hidden col-span-4 space-y-4 p-4 border-b">
                    {columns.map((col) => (
                        <div key={col.key} className="flex justify-between">
                            <span className="font-medium">{col.label}:</span>
                            <div>{renderContent(col.key)}</div>
                        </div>
                    ))}
                </div>
                {columns.map((col) => (
                    <div key={col.key} className="hidden md:block p-4">
                        {renderContent(col.key)}
                    </div>
                ))}
            </>
        );
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Wishlist</h2>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Table
                        columns={columns}
                        rows={rows}
                        renderHeader={renderHeader}
                        renderRow={renderRow}
                    />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};

export default Wishlist;
