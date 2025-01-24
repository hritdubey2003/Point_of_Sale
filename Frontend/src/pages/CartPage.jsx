import React, { useEffect, useState } from "react";
import LoggedNavbar from "../components/LoggedNavbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


function CartPage() {
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsAuthenticated(false);
        Navigate("/");
        return;
      }

      try {
        const response = await fetch("https://point-of-sale-bay.vercel.app/user/getcartItems", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setCart(data.cart);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          Navigate("/");
        }
      } catch (error) {
        setIsAuthenticated(false);
        Navigate("/");
      }
    };

    checkAuthentication();
  }, [Navigate]);

  const handleRemoveFromCart = async (serviceId) => {
    const token = localStorage.getItem("authToken");

    setLoading(true);

    try {
      const response = await fetch("https://point-of-sale-bay.vercel.app/user/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceId }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch("https://point-of-sale-bay.vercel.app/user/getcartItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const cartQuantity = Object.values(cart.services || []).reduce(
    (acc, service) => acc + service.quantity,
    0
  );

  return (
    <div>
      <LoggedNavbar cartQuantity={cartQuantity} />
      {isAuthenticated ? (
        <div className="cart-container p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200 min-h-screen">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">
            Your Cart
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {cart.services && cart.services.length > 0 ? (
              cart.services.map((service) => (
                <div
                  key={service.serviceId._id}
                  className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <img
                    src={service.serviceId.img_url || "/default-service-img.jpg"}
                    alt={service.serviceId.name}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                      {service.serviceId.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{service.serviceId.description}</p>
                    <p className="text-xl font-bold text-green-600 mb-4">
                      INR: {service.serviceId.price} x {service.quantity}
                    </p>

                    <div className="mt-6">
                      <button
                        onClick={() => handleRemoveFromCart(service.serviceId._id)}
                        disabled={loading}
                        className={`w-full py-2 text-white rounded-lg transition duration-300 ease-in-out transform ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {loading ? "Removing..." : "Remove from Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-xl text-gray-700">
                Your cart is empty. Add some services to your cart.
              </div>
            )}
          </div>
          {cart.totalPrice > 0 && (
            <div className="mt-12 text-center">
              <p className="text-2xl font-semibold text-gray-900">
                Total Price: <span className="text-green-600">INR: {cart.totalPrice}</span>
              </p>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-6 hover:bg-blue-700 transition duration-200 ease-in-out transform"
                onClick={() => Navigate("/checkout")}
              >
                Proceed to Purchase
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center mt-10 text-xl text-gray-700">
          You are not authenticated. Redirecting to Home...
        </div>
      )}
      <Footer />
    </div>
  );
}

export default CartPage;
