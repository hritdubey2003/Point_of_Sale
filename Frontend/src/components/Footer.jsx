import React, { useState } from "react";
import "../asset/Footer.css";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // State to manage email input value

  const mailtoSubscribe = (e) => {
    e.preventDefault(); // Prevent form submission and page reload

    if (email) {
      // Redirect to mailto link
      window.location.href = `mailto:newsletter@yourdomain.com?subject=Subscribe&body=Please subscribe me to the newsletter. My email is ${email}`;
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold mb-4">Our Company</h3>
          <p className="text-sm leading-relaxed">
            We are dedicated to providing exceptional service solutions to make
            your life easier. Trust us for quality and reliability.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#services"
                className="hover:underline"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#about-us"
                className="hover:underline"
                onClick={() => {
                  navigate("/");
                }}
              >
                About Us
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:underline">
                Contact: +91 9569922931
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:underline">
                FAQ: hritikdubey.direct@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
          <p className="text-sm leading-relaxed mb-4">
            Subscribe to our newsletter to get the latest updates and offers.
          </p>
          <form className="flex space-x-2" onSubmit={mailtoSubscribe}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)} // Update state
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-gray-400 hover:text-gray-200">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} UsersWish. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
