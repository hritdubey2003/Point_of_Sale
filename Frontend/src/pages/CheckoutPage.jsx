import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoggedNavbar from '../components/LoggedNavbar';
import Footer from '../components/Footer';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryYear: '',
    cvv: '',
    upiId: '',
    address: '',
    phoneNumber: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [billData, setBillData] = useState(null);
  const [cartData, setCartData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  // Fetching the data avaipable insde the cart for listing them to frontend UI
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!token) {
        setIsAuthenticated(false);
        navigate('/');
        return;
      }

      try {
        const response = await fetch('https://point-of-sale-bay.vercel.app/user/getcartItems', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setCartData(data.cart);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setIsAuthenticated(false);
        navigate('/');
      }
    };

    checkAuthentication();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBillData(formData);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const gotoService = async () => {
    try {
      const response = await fetch('https://point-of-sale-bay.vercel.app/user/cart/purchase', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Purchase Successful:', data);
        navigate('/services');
      } else {
        console.error('Failed to complete purchase:', data.message);
        alert('An error occurred while completing your purchase. Please try again.');
      }
    } catch (error) {
      console.error('Error calling purchase API:', error);
      alert('Failed to communicate with the server. Please check your connection.');
    }
  };

  return (
    <>
      <LoggedNavbar />
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-xl mt-10">
        {!isAuthenticated ? (
          <div className="text-center text-xl text-gray-700">
            You are not authenticated. Redirecting to Home...
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Checkout Page</h2>

            <form onSubmit={handleSubmit}>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Choose Payment Method</label>
                <div className="flex space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />
                    Credit/Debit Card
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={handlePaymentMethodChange}
                      className="mr-2"
                    />
                    UPI
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              {paymentMethod === 'card' && (
                <>
                  <div className="mb-4">
                    <label htmlFor="cardholderName" className="block text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder="Enter cardholder name"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="Enter card number"
                      required
                      className="w-full p-4 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex-1 mb-4">
                      <label htmlFor="expiryYear" className="block text-gray-700 mb-2">Expiry Year</label>
                      <input
                        type="number"
                        id="expiryYear"
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleChange}
                        placeholder="Expiry Year"
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex-1 mb-4">
                      <label htmlFor="cvv" className="block text-gray-700 mb-2">CVV</label>
                      <input
                        type="number"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="CVV"
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <div className="mb-6">
                  <label htmlFor="upiId" className="block text-gray-700 mb-2">Enter UPI ID</label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="Enter UPI ID"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              {/* Address and Phone Number */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-gray-700 mb-2">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full p-4 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full p-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg"
              >
                Proceed to Payment
              </button>
            </form>

            {/* Modal appearance for Billing System*/}
            {isModalOpen && cartData && (
              <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white rounded-lg p-8 shadow-lg w-96">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">Your Bill</h3>
                  <div className="mb-4">
                    {cartData.services.map((service, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-gray-700">
                          <strong>Service Name:</strong> {service.serviceId.name}
                        </p>
                      </div>
                    ))}
                    <p className="text-gray-700">
                      <strong>Total Amount:</strong> ₹{cartData.totalPrice}
                    </p>

                    {paymentMethod === 'card' && (
                      <>
                        <p className="text-gray-700">
                          <strong>Cardholder Name:</strong> {billData.cardholderName}
                        </p>
                        <p className="text-gray-700">
                          <strong>Card Number:</strong> {billData.cardNumber.replace(/\d(?=\d{4})/g, '*')}
                        </p>
                        <p className="text-gray-700">
                          <strong>Expiry Year:</strong> {billData.expiryYear}
                        </p>
                        <p className="text-gray-700">
                          <strong>CVV:</strong> ***
                        </p>
                      </>
                    )}
                    {paymentMethod === 'upi' && (
                      <p className="text-gray-700">
                        <strong>UPI ID:</strong> {billData.upiId}
                      </p>
                    )}
                    <p className="text-gray-700">
                      <strong>Address:</strong> {billData.address}
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone Number:</strong> {billData.phoneNumber}
                    </p>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={handlePrint}
                      className="p-3 bg-indigo-600 text-white rounded-lg"
                    >
                      Print Bill
                    </button>
                    <button
                      onClick={gotoService}
                      className="p-3 bg-gray-300 text-gray-700 rounded-lg"
                    >
                      Go Back to Service
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
