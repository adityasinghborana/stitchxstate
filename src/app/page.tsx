import HeroBanner from '@/components/widget/HeroBanner'
import React from 'react'
import BlackFridayHero from '@/components/widget/BlackFridayHero'
import CategoryPromoSection from '@/components/widget/CategoryPromoSection'
import EssentialHero from '@/components/widget/EssentialHero'
import Essential2 from '../components/widget/Essential2'
import Look from '@/components/widget/Look'
import { CategoryEntity } from '@/core/entities/category.entity'
import Category from '@/components/widget/Category'
import { getCategories } from '@/lib/category/getCategories'
const Hero =async () => {
  const categories = await getCategories();
  return (
    <div>
        <HeroBanner/>
        <BlackFridayHero/>
        <CategoryPromoSection/>

        <div className='w-[75%] mx-auto'>
          <EssentialHero/>
          <Look/>
          <Category categories={categories.slice(0,4)}/>
          <Essential2/>
      </div>
    </div>
  )
}

export default Hero