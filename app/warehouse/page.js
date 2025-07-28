'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/config/axiosInstance';
import { useRouter } from 'next/navigation';

const WarehousesPage = () => {
  const router = useRouter()
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  });

  const fetchWarehouses = async () => {
    try {
      const res = await axiosInstance.get('/warehouse');
      setWarehouses(res.data.data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/warehouse', formData);
      setFormData({ name: '', latitude: '', longitude: '' });
      fetchWarehouses();
    } catch (err) {
      console.error('Error adding warehouse:', err);
    }
  };


  const handleNavigation = (warehouseId) =>  {
    router.push(`/warehouse/${warehouseId}`)
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Warehouse Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="Warehouse Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="latitude"
          placeholder="Latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded hover:bg-blue-700 transition p-2"
        >
          Add Warehouse
        </button>
      </form>

      {/* Warehouse Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="bg-white p-4 shadow rounded flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{warehouse.name}</h2>
              <p className="text-sm text-gray-600">Latitude: {warehouse.latitude}</p>
              <p className="text-sm text-gray-600">Longitude: {warehouse.longitude}</p>
            </div>
            <button
              onClick={() => handleNavigation(warehouse.id)}
              className="mt-4 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WarehousesPage;
