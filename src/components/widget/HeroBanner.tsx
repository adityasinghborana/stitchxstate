import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { slides } from './slideData'
import Image from 'next/image'
const HeroBanner = () => {
  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="w-full h-[80vh] relative"
    >
      <CarouselContent>
        {slides.map((item, index) => (
          <CarouselItem key={index} className="w-full">
            <div className="relative w-full h-[80vh] overflow-hidden">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.altText}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
          </CarouselItem>
        ))}

      </CarouselContent>
      <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
       <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
    </Carousel>
  )
}

export default HeroBanner;