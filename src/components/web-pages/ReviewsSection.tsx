import React from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      author: 'Sarah Ahmed',
      rating: 5,
      comment:
        'Amazing food! The royal biryani was absolutely delicious and packed with authentic flavors. Will definitely order again!',
    },
    {
      id: 2,
      author: 'James Miller',
      rating: 5,
      comment:
        'Great taste, fast delivery and very friendly staff. The Old Delhi butter chicken is unmatched in quality. Highly recommended!',
    },
    {
      id: 3,
      author: 'Ayesha Rahman',
      rating: 5,
      comment:
        'Authentic flavors and excellent quality. The tandoori chicken skewers were so tender and juicy. My family loved it!',
    },
  ];

  return (
    <section className="bg-white border-y border-[#EAEAEA] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Exact Poppins Spec */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="section-decorator" />
            <h2 className="section-title">
              Loved by Food Lovers
            </h2>
            <p className="section-subtitle mt-1">
              Real experiences and reviews from our cherished diners
            </p>
          </div>

          {/* Arrow Controls */}
          <div className="flex items-center gap-2 pb-1">
            <button
              className="w-8 h-8 rounded-full border border-[#E5E5E5] hover:border-[#B84A22] text-[#2C221C] hover:text-[#B84A22] flex items-center justify-center transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-full border border-[#E5E5E5] hover:border-[#B84A22] text-[#2C221C] hover:text-[#B84A22] flex items-center justify-center transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-[rgb(249,249,249)] border border-[#E5E5E5] rounded-2xl flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#B84A22] font-bold text-sm flex items-center justify-center border border-[#E5E5E5]">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#3D3D3D]">
                      {rev.author}
                    </h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D49B37] text-[#D49B37]" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#747474] leading-relaxed italic">
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
