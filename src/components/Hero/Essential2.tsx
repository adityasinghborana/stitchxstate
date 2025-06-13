import React from 'react';
import Image from 'next/image'; 
import image1 from '../../../public/images/Essential2_image1.jpg'
import image2 from '../../../public/images/Essential2_image2.jpg'
import image3 from '../../../public/images/Essential2_image3.jpg'
// Main App component
const App = () => {
  // Data for the image cards
  const imageCards = [
    {
      date: 'May 10, 2018',
      title: 'Looks we love',
      // Using a placeholder image URL for the standard <img> tag
      imageUrl: image1,
      altText: 'Looks we love',
      width: 370,
      height: 450 // These are now hints for the image size, not strict requirements for the <img> tag
    },
    {
      date: 'May 01, 2018',
      title: '10 ways to unwind',
      imageUrl: image2,
      altText: '10 ways to unwind',
      width: 370,
      height: 450
    },
    {
      date: 'Apr 30, 2018',
      title: 'Featured designer: Bethany Jones',
      imageUrl: image3,
      altText: 'Featured designer: Bethany Jones',
      width: 370,
      height: 450
    },
  ];

  return (
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {imageCards.map((card, index) => (
          <div key={index} className="flex flex-col items-center bg-white   overflow-hidden transform transition-transform duration-300 hover:scale-105 w-full md:w-auto">
            <div className="w-full h-auto overflow-hidden ">
              <Image
                src={card.imageUrl}
                alt={card.altText}
                className="w-full h-full object-cover"
                width={card.width}
                height={card.height}
              />
            </div>
            {/* Text content */}
            <div className="p-4 text-center">
              <p className="text-[#5B4B43] text-sm mb-1">{card.date}</p>
              <h3 className="text-sm font-semibold text-[#5B4B43]">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
  );
};

export default App;
