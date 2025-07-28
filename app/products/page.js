'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import axiosInstance from '@/config/axiosInstance'
import Script from 'next/script'

export default function ProductPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/product')
        const dataWithQuantity = res.data.data.map(data => ({...data,qty : 0}))
        setProducts(dataWithQuantity)
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    }

    fetchProducts()
  }, [])


  const handlePayment = async (product) => {
    const userLocal = localStorage.getItem('user')
    const user = JSON.parse(userLocal)
        try {
            const res = await axiosInstance.post(`/order`, {user_id:user.id,...product});
            handlePaymentVerify(res.data.data)
        } catch (error) {
            console.log(error);
        }
    }


     const updateQuantity = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };


    const handlePaymentVerify = async (data) => {
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
            amount: data.price,
            // currency: data.currency,
            currency : "INR",
            name: "Dharmi Chand",
            description: "Test Mode",
            // order_id: data.id,
            order_id : data.order_id,
            handler: async (response) => {
                try {
                    const res = await axiosInstance.post(`/payment/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                    })

                    if (res.data.message) {
                        alert(res.data.message)
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

  const handleBuy = async(product) => {
    if (product.quantity === 0) {
      alert(`${product.name} is out of stock!`)
      return
    }
    const result = await axiosInstance.post('/order',product)
    alert(`You bought: ${product.name} for ${product.price}`)
    // Add purchase logic here
  }

  return (
    <>
    <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Razor Pay script loaded!');
        }}
      />
    {/* <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <Image
              src={product.image || '/product.jpg'}
              alt={product.name}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                <ul className="text-sm space-y-1 mb-4">
                  <li><span className="font-medium">Price:</span> ₹{product.price}</li>
                  <li>
                    <span className="font-medium">Quantity:</span>{' '}
                    {Number(product.quantity) > 0 ? Number(product.quantity) : <span className="text-red-600">Out of stock</span>}
                  </li>
                </ul>
                
              <button
                onClick={() => handlePayment(product)}
                disabled={Number(product.quantity) === 0}
                className={`mt-auto w-full px-4 py-2 rounded ${
                  Number(product.quantity) === 0
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Buy
              </button>
                    <button>add</button>
                    <span>{product.qty || 12}</span>
                    <button>decrease</button>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div> */}
    <div className="min-h-screen bg-gray-100 py-8 px-4">
  <h1 className="text-3xl font-bold text-center mb-8">Products</h1>
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
    {products.map((product) => (
      <div
        key={product.id}
        className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
      >
        <Image
          src={product.image || '/product.jpg'}
          alt={product.name}
          width={500}
          height={300}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 flex flex-col flex-grow justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
            <ul className="text-sm space-y-1 mb-4">
              <li>
                <span className="font-medium">Price:</span> ₹{product.price}
              </li>
              <li>
                <span className="font-medium">Stock:</span>{' '}
                {Number(product.quantity) > 0 ? (
                  <span className="text-green-700">{product.quantity}</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </li>
            </ul>

            <div className="flex items-center justify-between gap-2 mb-4">
              <button
                onClick={() => updateQuantity(product.id,-1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
              >
                −
              </button>
              <span className="text-md font-medium">
                {product.qty}
              </span>
              <button
                onClick={() => updateQuantity(product.id,1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => handlePayment(product)}
            disabled={Number(product.quantity) === 0}
            className={`mt-auto w-full px-4 py-2 rounded ${
              Number(product.quantity) === 0
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Buy
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </>
  )
}
