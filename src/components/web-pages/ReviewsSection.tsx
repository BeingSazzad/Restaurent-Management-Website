import React from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Sarah Ahmed',
      location: 'Dublin 2 Diner',
      avatar: '/images/avatars/sarah.jpg',
      rating: 5,
      comment:
        'Amazing food! The royal biryani was absolutely delicious, perfectly spiced and packed with authentic flavors. Tender meat that melted in the mouth. Will definitely order again!',
    },
    {
      id: 2,
      author: 'James Miller',
      location: 'Ranelagh Diner',
      avatar: '/images/avatars/james.jpg',
      rating: 5,
      comment:
        'Great taste, fast delivery and very friendly staff. The Old Delhi butter chicken is unmatched in quality anywhere in Dublin. Truly authentic restaurant experience at home!',
    },
    {
      id: 3,
      author: 'Ayesha Rahman',
      location: 'Ballsbridge Diner',
      avatar: '/images/avatars/ayesha.jpg',
      rating: 5,
      comment:
        'Authentic flavors and excellent quality. The tandoori chicken skewers were so tender, juicy and smoky. My family loved every bite of the garlic naans too!',
    },
  ];

  return (
    <section className="bg-[rgb(249,249,249)] py-16 sm:py-20 border-t border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Exact Poppins Spec */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <div className="section-decorator" />
            <h2 className="section-title">
              Loved by Food Lovers
            </h2>
            <p className="section-subtitle mt-1.5">
              Real dining experiences and reviews from our cherished guests across Dublin
            </p>
          </div>

          {/* Arrow Controls */}
          <div className="flex items-center gap-2 pb-1">
            <button
              className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] hover:border-[#B84A22] text-[#2C221C] hover:text-[#B84A22] flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button
              className="w-9 h-9 rounded-full bg-white border border-[#E5E5E5] hover:border-[#B84A22] text-[#2C221C] hover:text-[#B84A22] flex items-center justify-center transition-all hover:scale-105 shadow-xs"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 sm:p-7 bg-white border border-[#E5E5E5] rounded-3xl flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Author Avatar, Name, Location & Stars */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B84A22]/20 shadow-xs shrink-0 bg-[#251D17]">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-[16px] text-[#1A130E] leading-tight">
                        {rev.author}
                      </h4>
                      <span className="text-[12px] font-medium text-[#747474] block mt-0.5">
                        {rev.location}
                      </span>
                    </div>
                  </div>

                  <Quote className="w-5 h-5 text-[#B84A22]/25 shrink-0" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D49B37] text-[#D49B37]" />
                  ))}
                  <span className="text-[12px] font-bold text-[#1A130E] ml-1.5">5.0</span>
                </div>

                {/* Clear, Readable Review Body */}
                <p className="text-[14px] sm:text-[15px] text-[#3D3D3D] leading-[24px] font-normal">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
