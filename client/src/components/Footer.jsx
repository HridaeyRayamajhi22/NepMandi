import React from 'react'
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className='border-t bg-white shadow-lg mt-10'>
      <div className='container mx-auto p-5 flex flex-col lg:flex-row  lg:justify-between gap-4 items-center'>
        <p>@ All Rights Reserved 2025</p>
        <div className='flex p-1 mr-5 justify-center items-center gap-6 text-2xl'>
          <a
            href="https://www.facebook.com/HridaaeyRayamajhi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3ffe5b] hover:bg-[#2d3748] transform hover:scale-110 transition-all duration-300 ease-in-out"
          >
            <FaFacebookSquare />
          </a>
          <a href="https://www.instagram.com/hridaeyrayamajhi/"
            target="_blank"
            rel="noopener noreferrer"


            className="hover:text-[#3ffe5b] hover:bg-[#2d3748] transform hover:scale-110 transition-all duration-300 ease-in-out">
            <FaInstagram />
          </a>
          <a href="https://www.linkedin.com/hridaey__"
            target="_blank"
            rel="noopener noreferrer"

            className="hover:text-[#3ffe5b] hover:bg-[#2d3748] transform hover:scale-110 transition-all duration-300 ease-in-out">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
