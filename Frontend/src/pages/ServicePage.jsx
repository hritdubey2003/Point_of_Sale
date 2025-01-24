import React, { useEffect, useState } from "react";
import LoggedNavbar from "../components/LoggedNavbar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function ServicePage() {
  const [services, setServices] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cart, setCart] = useState({});
  const [localQuantities, setLocalQuantities] = useState({}); 
  const [loading, setLoading] = useState({});
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
        const response = await fetch("https://point-of-sale-bay.vercel.app/user/services", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setServices(data.data); // Store fetched services
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          Navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        Navigate("/");
      }
    };

    checkAuthentication();
  }, [Navigate]);

  useEffect(() => {
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

    fetchCart();
  }, []);

  // Taking care of the quantity
  const handleQuantityChange = (serviceId, change) => {
    setLocalQuantities((prev) => {
      const updatedQuantities = { ...prev };
      updatedQuantities[serviceId] = (updatedQuantities[serviceId] || 0) + change;
      if (updatedQuantities[serviceId] < 0) updatedQuantities[serviceId] = 0; 
      return updatedQuantities;
    });
  };

  // fetching the add to cart API from Backend
  const handleAddToCart = async (service) => {
    const quantity = localQuantities[service._id] || 0;
    if (quantity === 0) return;

    setLoading((prev) => ({ ...prev, [service._id]: true })); // Set loading for this specific service

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://point-of-sale-bay.vercel.app/user/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          sellerId: service.sellerId,
          quantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart); 
        setLocalQuantities((prev) => ({
          ...prev,
          [service._id]: 0,
        }));
      } else {
        console.error("Error adding to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading((prev) => ({ ...prev, [service._id]: false })); 
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
        <div className="services-container p-8 bg-gray-50 min-h-screen">
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-12">
            Our Premium Services! "
            Ghar Ho Ye Office, We're Perfect at Service!"
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
              >
                <img
                  src={service.img_url || "/default-service-img.jpg"}
                  alt={service.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <p className="text-xl font-bold text-green-600 mb-4">
                    ${service.price}
                  </p>

                  <div className="flex justify-center items-center space-x-4 mb-4">
                    <button
                      onClick={() => handleQuantityChange(service._id, 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      +
                    </button>
                    <span className="text-lg font-semibold">
                      {localQuantities[service._id] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(service._id, -1)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      -
                    </button>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => handleAddToCart(service)}
                      disabled={loading[service._id]} // Disable only this button
                      className={`w-full py-2 text-white rounded-lg transition duration-200 ${
                        loading[service._id]
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loading[service._id] ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-xl text-gray-700">
          You are not authenticated. Redirecting to Home...
        </div>
      )}
      <Footer/>
    </div>
  );
}

export default ServicePage;
