import React from 'react'
import Image from 'next/image'
import CategoryPromotion1 from "../../../public/images/categoryPromotion1.jpg"
import CategoryPromotion2 from "../../../public/images/CategoryPromotion2.jpg";
import { Button } from '../ui/button'
const CategoryPromoSection = () => {
  return (
    <div className='flex'>
        {/* left section */}
        <div className='relative w-[49%] h-[400px] ml-2'>
            <Image
            src={CategoryPromotion1}
            alt='promotion'
            className='object-cover'
            fill
            />

            {/* overlay content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white  bg-opacity-30">
                <h1 className="text-3xl md:text-5xl font-light mb-2 tracking-wide">NEW ARRIVAL</h1>
                <h1 className="text-3xl md:text-5xl font-serif mb-2 tracking-wide">DENIM</h1>
                <Button className=' rounded-none bg-[#021826]'>EXPLORE COLLECTION</Button>
            </div>
        </div>


        {/* Right section */}
        <div className='relative w-[49%] h-[400px] mr-2 ml-3'>
            <Image
            src={CategoryPromotion2}
            alt='promotion'
            className='object-cover'
            fill
            />

            {/* overlay content */}
            <div className="absolute inset-0 flex text-center flex-col items-center justify-center text-white  bg-opacity-30">
                <h1 className="text-4xl md:text-5xl font-light mb-2 tracking-wide">GIFT CARDS</h1>
                <p> Help support Local business by buying a gift card<br></br> Local pickup Available</p>
                <Button className=' rounded-none bg-white text-black mt-2 font-bold'>SHOP GIFT CARDS</Button>
            </div>
        </div>
    </div>
  )
}

export default CategoryPromoSection