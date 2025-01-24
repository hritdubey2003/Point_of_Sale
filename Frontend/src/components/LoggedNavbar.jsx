import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.svg";

function LoggedNavbar({ cartQuantity }) {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleCartClick = () => {
    console.log("I am here")
    navigate("/cart"); // This is triggered on clicking the cart button
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <header className="relative w-full bg-white text-sm py-3 dark:bg-neutral-800">
      <nav className="max-w-[85rem] mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a
          className="text-xl font-semibold dark:text-white focus:outline-none"
          href="/"
          aria-label="Brand"
        >
          <img src={logo} alt="Logo" className="w-10 h-auto" />
        </a>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          type="button"
          className="sm:hidden relative z-10 flex items-center justify-center w-10 h-10 text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-neutral-700 dark:text-white dark:border-neutral-700 focus:outline-none"
          aria-expanded={openMenu}
          aria-label="Toggle navigation"
        >
          {openMenu ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Cart Indicator */}

        <div className="relative sm:flex sm:items-center sm:gap-5 w-full sm:w-auto sm:static absolute bg-white dark:bg-neutral-800 left-0 top-full sm:top-auto sm:left-auto sm:bg-transparent sm:dark:bg-transparent p-5 sm:p-0 shadow-lg sm:shadow-none z-9 sm:z-auto transition-all">
          <button
            className="flex items-center space-x-2 text-blue-500 font-medium focus:outline-none"
            onClick={handleCartClick}
          >
            <span>Cart</span>
            <span className="inline-flex justify-center items-center w-6 h-6 text-xs font-semibold text-white bg-red-500 rounded-full">
              {cartQuantity || 0}
            </span>
          </button>

          <a
            className="block sm:inline font-medium text-gray-600 hover:text-gray-400 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500"
            href="javascript:void(0)"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </a>
          <a
            className="block sm:inline font-medium text-gray-600 hover:text-gray-400 focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-500"
            href="javascript:void(0)"
            onClick={() => {
              navigate("/services");
            }}
          >
            Services
          </a>
        </div>
      </nav>
    </header>
  );
}

export default LoggedNavbar;
