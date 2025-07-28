'use client'

import axiosInstance from '@/config/axiosInstance'
import { useState,useEffect } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState([
    { id: 1, product: 'iPhone 14', quantity: 2, price: 1200, status: 'pending' },
    { id: 2, product: 'MacBook Pro', quantity: 1, price: 2500, status: 'pending' },
    { id: 3, product: 'AirPods Max', quantity: 3, price: 599, status: 'pending' },
  ])

  const handleAction = (id, action) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: action } : order
      )
    )
  }

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/order");
      const fetchedOrders= res.data.data;
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {

    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  const updateOrderState = async(id,state) => {
    try{
        await axiosInstance.put(`/order/${id}/state`,{state : state})
        alert('Order state has been updated')
        fetchOrders()
    }
    catch(err){
        console.log('Erorr on Updating Status',err.message)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Orders</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {orders.map(order => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{order.product}</h2>
              <p className="text-gray-600 mt-2">Quantity: {order.quantity}</p>
              <p className="text-gray-600">Price: ₹{order.price}</p>
              <span className={`inline-block mt-4 px-3 py-1 text-sm rounded-full font-medium ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => updateOrderState(order.id, 'accepted')}
                // disabled={order.status !== 'pending'}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                Accept
              </button>
              <button
                onClick={() => updateOrderState(order.id, 'rejected')}
                // disabled={order.status !== 'pending'}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No orders available.</p>
      )}
    </div>
  )
}
