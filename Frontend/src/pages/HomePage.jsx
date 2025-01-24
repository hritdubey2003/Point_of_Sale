import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../asset/HomePage.css'
import { redirect, useNavigate } from 'react-router-dom'

function HomePage() {
    const navigate = useNavigate()
  return (
    <>
      <Navbar className="bg-transparent" />
      <div className="h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative overflow-hidden text-white">
        {/* Dandelion Animation Block Section*/}
        <div className="dandelion-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="dandelion" style={{ '--i': i }}></div>
          ))}
        </div>

        {/* Main Component Section */}
        <section className="flex flex-col items-center justify-center h-full px-4 text-center animate-fade-in z-10 relative">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            One Point Solution to Every <br /> Service-Related Problem!
          </h1>
          <p className="text-lg max-w-2xl mb-8">
            Offering fast, reliable, and professional services tailored just for
            you. From quick repairs to home maintenance – we’ve got you
            covered!
          </p>
          <button onClick={ () => { navigate('/signup')}} className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-700 hover:text-white transition-all duration-300">
            Explore Services
          </button>
        </section>

        {/* WHat makes us better */}
        <section className="py-20 bg-white text-gray-800 rounded-t-3xl relative z-20">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8 md:px-20">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <img
                  src="/images/expert-team.svg"
                  alt="Expert Team"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-semibold text-lg">Expert Team</h3>
              <p className="text-sm text-gray-600">
                Our team is highly experienced and skilled to handle every
                service need.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <img
                  src="/images/affordable.svg"
                  alt="Affordable Pricing"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-semibold text-lg">Affordable Pricing</h3>
              <p className="text-sm text-gray-600">
                Get premium services at prices that fit your budget.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <img
                  src="/images/fast-service.svg"
                  alt="Fast Service"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-semibold text-lg">Fast Service</h3>
              <p className="text-sm text-gray-600">
                We prioritize speed without compromising quality.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <img
                  src="/images/customer-support.svg"
                  alt="24/7 Support"
                  className="w-8 h-8"
                />
              </div>
              <h3 className="font-semibold text-lg">24/7 Support</h3>
              <p className="text-sm text-gray-600">
                Always available to address your queries and provide assistance.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer/>
    </>
  )
}

export default HomePage