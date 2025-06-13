import React from 'react'
import capsule from "../../../public/images/capusule.png"
import Image from 'next/image'
import { Button } from '../ui/button'
import Essential1 from '../../../public/images/essentialHero2.webp'
import Essential2 from '../../../public/images/essentialHero3.webp'
import Look from './Look'
const EssentialHero = () => {
  return (
        <div className='text-center mt-10'>
            <h1 className='text-[#5B4B43]'>Fashion inspired by where we're from - the sunny shores of California.
                <br></br>Products provided by <span className='underline'>PIKO</span>
            </h1>
            <div className='relative  h-[400px] mx-auto mt-10 mb-5 text-center text'>
                <Image
                src={capsule}
                alt='Black Friday Image'
                fill
                className='object-cover '
                priority
            />
            {/* overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white  bg-opacity-30">
                <h6 className='font-thin text-gray-300'>ESSENTIALS</h6>
                <h1 className="text-3xl md:text-5xl font-extralight mb-2 tracking-wide">B&W CAPSULE</h1>
                <p className='font-thin text-xs'>Get the perfact look for your fall classic wardobe</p>
                <Button className='bg-white text-black rounded-none mt-3 font-bold'>SHOP ALL</Button>

            </div>
            </div>
            <div className='mt-3 flex  '>
                {/* left section */}
               <div className='bg-gray-100 W-[49%] md:w-[49%] flex flex-col md:flex-row h-72'> {/* Added responsiveness */}
                    {/* Left section for text */}
                    <div className='flex flex-col justify-center items-center p-4 w-full md:w-1/2 text-center'>
                        <h4 className='text-xl font-serif text-gray-800' style={{ color: '#5B4B43' }}>UP TO</h4> 
                        <h6 className='text-6xl font-bold my-2' style={{ color: '#5B4B43' }}>50%</h6> 
                        <p className='text-sm tracking-wider text-gray-700' style={{ color: '#5B4B43' }}>OFF SELECT PRODUCTS</p> 
                    </div>

                    {/* Right section for images */}
                    <div className='flex justify-center items-center w-full md:w-1/2 '> 
                        <Image
                        src={Essential1}
                        alt='essential1'
                        width={200}
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                        <Image
                        src={Essential2}
                        alt='essential2'
                        width={200} 
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                    </div>
                </div>
                {/* right section */}
                <div className='bg-gray-100 W-[49%] md:w-[49%] flex ml-6 flex-col md:flex-row h-72'> {/* Added responsiveness */}
                    {/* Left section for text */}
                    <div className='flex flex-col justify-center items-center p-4 w-full md:w-1/2 text-center'>
                        <h4 className='text-xl font-serif text-gray-800' style={{ color: '#5B4B43' }}>UP TO</h4> 
                        <h6 className='text-6xl font-bold my-2' style={{ color: '#5B4B43' }}>50%</h6> 
                        <p className='text-sm tracking-wider text-gray-700' style={{ color: '#5B4B43' }}>OFF SELECT PRODUCTS</p> 
                    </div>

                    {/* Right section for images */}
                    <div className='flex justify-center items-center w-full md:w-1/2 '> 
                        <Image
                        src={Essential1}
                        alt='essential1'
                        width={200}
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                        <Image
                        src={Essential2}
                        alt='essential2'
                        width={200} 
                        height={200} 
                        objectFit="contain"
                        className='overflow-hidden'
                        />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default EssentialHero;   