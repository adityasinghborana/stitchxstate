import React from 'react'
import Look1 from "../../../public/images/look1.png"
import Look2 from "../../../public/images/look2.avif"
import Image from 'next/image'
const Look = () => {
 return (
    // Main container div: 75% width on larger screens, centered, flex layout
    // Added a minimum height to ensure content has space
    <div className='flex flex-col md:flex-row  mx-auto bg-white  overflow-hidden my-8 min-h-[400px]'>

      {/* Left Section: Main Look Image and "SHOP THE LOOK" text */}
      <div className='w-full md:w-3/4 p-4 md:p-0 flex flex-col'>
        <h2 className='text-xl font-serif text-gray-800 p-4 pb-0 md:pl-8' style={{ color: '#5B4B43' }}>SHOP THE LOOK</h2>
        {/*
          New approach: Create a div with a fixed height to contain the image,
          and let the Image component fill this container.
        */}
        <div className='flex justify-center items-center overflow-hidden w-full' style={{ height: '700px' }}> {/* Explicit height for the container */}
          {/* Main model image */}
          {/* width and height props are for optimization. className="w-full h-full" makes the image
              visually fill its parent container, which now has a fixed height. */}
          <Image
            src={Look1}
            alt="Model wearing the look"
            width={700} // Used for optimization and aspect ratio reservation
            height={600} // Used for optimization and aspect ratio reservation
            objectFit="cover" // Fills the container, crops if aspect ratio differs
            className="w-full h-full" // Ensure image visually fills its parent container's width and height
          />
        </div>
      </div>

      {/* Right Section: Product Details */}
      <div className='w-full md:w-1/4 p-4 md:p-8 flex flex-col items-center justify-center bg-gray-50' style={{ backgroundColor: '#F8F8F8' }}>
        <div className='flex flex-col items-center text-center'>
          {/* Product image */}
          {/* New approach: Create a div with a fixed height to contain the image. */}
          <div className='flex justify-center items-center overflow-hidden mb-4 rounded-md' style={{ width: '200px', height: '400px' }}> {/* Explicit dimensions for the container */}
            <Image
              src={Look2} 
              alt="Rosewood DLMN Knotted High-Low Top"
              width={200} 
              height={400} 
              objectFit="contain" 
              className="w-full h-full" 
            />
          </div>

          {/* Product Name */}
          <h3 className='text-base font-medium text-gray-700 leading-tight mb-1' style={{ color: '#5B4B43' }}>
            Rosewood DLMN Knotted High-Low Top
          </h3>
          {/* Product Price */}
          <p className='text-lg font-bold text-gray-900' style={{ color: '#5B4B43' }}>
            $46
          </p>
        </div>
      </div>
    </div>
  );
}

export default Look