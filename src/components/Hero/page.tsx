import HeroBanner from './HeroBanner'
import React from 'react'
import BlackFridayHero from './BlackFridayHero'
import CategoryPromoSection from './CategoryPromoSection'
import EssentialHero from './EssentialHero'
import Essential2 from './Essential2'
import Look from './Look'
const Hero = () => {
  return (
    <div>
        <HeroBanner/>
        <BlackFridayHero/>
        <CategoryPromoSection/>

        <div className='w-[75%] mx-auto'>
          <EssentialHero/>
          <Look/>
          <Essential2/>

      </div>
    </div>
  )
}

export default Hero