'use client';

import Link from 'next/link';
import { IoCloseOutline } from "react-icons/io5";
import { FaInstagram, FaPinterest } from "react-icons/fa";
import React from 'react'; // Explicitly import React for JSX type inference
import { RiFacebookCircleFill } from "react-icons/ri";
// Define the types for the props that MobileMenu will receive
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void; // onClose is a function that takes no arguments and returns nothing
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  return (
    // Fixed overlay for the sidebar
    <div
      className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`} // Only visible on screens smaller than 'md'
    >
      <div className="flex justify-end p-4 border-b border-gray-100">
        <button onClick={onClose} className="text-gray-700 text-3xl p-2" aria-label="Close mobile menu">
          <IoCloseOutline />
        </button>
      </div>
      <nav className="flex flex-col p-6 space-y-6 text-lg font-medium">
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">SHOP</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">SEASON</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">JOURNAL</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">THEME FEATURES</span></Link>
        
        <hr className="my-4 border-gray-200" /> {/* Separator */}

        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">Tops</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">Tunics</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">Dresses</span></Link>
        <Link href="#" onClick={onClose}><span className="hover:text-blue-600 transition-colors duration-200">Sweatshirts</span></Link>

        <hr className="my-4 border-gray-200" /> {/* Separator */}

        {/* Social Icons for mobile menu */}
        <div className="flex space-x-6 justify-center mt-6">
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl text-gray-600 hover:text-blue-600 transition-colors" />
          </Link>
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <RiFacebookCircleFill className="text-2xl text-gray-600 hover:text-blue-600 transition-colors" />
          </Link>
          <Link href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
            <FaPinterest className="text-2xl text-gray-600 hover:text-blue-600 transition-colors" />
          </Link>
        </div>
        <span className="text-center text-sm text-gray-500 mt-2">Israel (USD $)</span>
      </nav>
    </div>
  );
};

export default MobileMenu;