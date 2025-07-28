'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";

const WarehouseDetailPage = () => {
  const { id } = useParams();
  const [warehouse, setWarehouse] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  useEffect(() => {
    if (id) {
      fetchWarehouse();
      fetchProducts();
    }
  }, [id]);

  const fetchWarehouse = async () => {
    try {
      const res = await axiosInstance.get(`/warehouse/${id}`);
      setWarehouse(res.data.data);
    } catch (err) {
      console.error("Failed to fetch warehouse:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get(`/product/${id}`);
      console.log('>>>>res.>>>>',res)
      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/product/${id}`, formData);
      fetchProducts(); // refresh list
      setFormData({ name: "", price: "", quantity: "" });
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Warehouse: {warehouse?.name}</h2>

      {/* Add Product Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-50 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Add Product</h3>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold mb-2">Product List</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 bg-white rounded shadow flex justify-between">
              <div>
                <p><strong>{product.name}</strong></p>
                <p>Price: ₹{product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WarehouseDetailPage;
