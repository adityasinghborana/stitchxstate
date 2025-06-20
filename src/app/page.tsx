import HeroBanner from '@/components/widget/HeroBanner'
import React from 'react'
import BlackFridayHero from '@/components/widget/BlackFridayHero'
import CategoryPromoSection from '@/components/widget/CategoryPromoSection'
import EssentialHero from '@/components/widget/EssentialHero'
import Essential2 from '../components/widget/Essential2'
import Look from '@/components/widget/Look'
import Category from '@/components/widget/Category'
import { getCategories } from '@/lib/category/getCategories'
import { getHomePage } from '@/lib/HomePageSection/getHomePage';
const Hero =async () => {
  const categories = await getCategories();
  const homepageContent = await getHomePage();
  if (!homepageContent) {
    return <div className="text-center py-10">Failed to load homepage content.</div>;
  }
  return (
    <div>
        <HeroBanner homepageSection={homepageContent} />
        <BlackFridayHero homepageSection={homepageContent} />
        <CategoryPromoSection homepageSection={homepageContent} />

        <div className='w-[75%] mx-auto'>
          <EssentialHero homepageSection={homepageContent} />
        <Look homepageSection={homepageContent} />
          <Category categories={categories.slice(0,4)}/>
          <Essential2 homepageSection={homepageContent}/>
      </div>
    </div>
  )
}

export default Hero