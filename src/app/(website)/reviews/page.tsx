'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, CheckCircle, ThumbsUp, MessageSquare, ArrowRight } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  location: string;
  rating: number;
  date: string;
  dish: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

const REVIEWS_DATA: Review[] = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    location: 'Dublin 2 (Grafton Area)',
    rating: 5,
    date: 'Yesterday',
    dish: "Chef's Signature Dum Biryani",
    comment:
      'The Dum Biryani came in a beautiful seal-packed handi. The aroma of saffron and cardamom hit me immediately when I opened it. Grains were separate and the lamb was tender enough to fall off the bone. Easily the best biryani in Dublin!',
    verified: true,
    helpfulCount: 24,
  },
  {
    id: 2,
    name: 'James Miller',
    location: 'Dublin 4 (Ballsbridge)',
    rating: 5,
    date: '3 days ago',
    dish: 'Old Delhi Butter Chicken',
    comment:
      'Proper authentic Old Delhi style—not the overly sweet versions you get elsewhere. Rich cultured butter, deep roasted cashew gravy, and smoky charred chicken pieces. Garlic naan was still hot and blistered when it arrived.',
    verified: true,
    helpfulCount: 18,
  },
  {
    id: 3,
    name: 'Ayesha Rahman',
    location: 'Dublin 6 (Ranelagh)',
    rating: 5,
    date: 'Last week',
    dish: 'Tandoori Chicken Skewers',
    comment:
      'The charred smoky flavor from the clay tandoor is unmatched. Juicy on the inside with a spicy yogurt crust. Plus delivery was super quick (around 25 mins). Highly recommend!',
    verified: true,
    helpfulCount: 15,
  },
  {
    id: 4,
    name: 'Cian O’Connor',
    location: 'Dublin 1 (City Centre)',
    rating: 5,
    date: '2 weeks ago',
    dish: 'Grand Amber Family Feast',
    comment:
      'Ordered the family combo for a Friday night gathering with 4 friends. The portions were extremely generous, packaged cleanly with raita, salan, and garlic naans. Everyone was raving about it.',
    verified: true,
    helpfulCount: 31,
  },
  {
    id: 5,
    name: 'Elena Rostova',
    location: 'Dublin 8 (Portobello)',
    rating: 5,
    date: '3 weeks ago',
    dish: 'Clay Oven Tandoori Naan Pizza',
    comment:
      'A very creative twist on tandoori chicken! The crust was crispy yet chewy, spiced to perfection. Also appreciate the eco-friendly packaging they use.',
    verified: true,
    helpfulCount: 9,
  },
];

export default function CustomerReviewsPage() {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '', dish: '' });
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS_DATA);

  const filtered =
    filterRating === 'all'
      ? reviewsList
      : reviewsList.filter((r) => r.rating === filterRating);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const added: Review = {
      id: Date.now(),
      name: newReview.name,
      location: 'Dublin Diner',
      rating: newReview.rating,
      date: 'Just now',
      dish: newReview.dish || 'Chef Specialty',
      comment: newReview.comment,
      verified: true,
      helpfulCount: 1,
    };
    setReviewsList([added, ...reviewsList]);
    setShowReviewModal(false);
    setNewReview({ name: '', rating: 5, comment: '', dish: '' });
    alert('Thank you! Your verified review has been submitted.');
  };

  return (
    <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="section-decorator mx-auto" />
        <h1 className="section-title mb-3">Loved by Dublin Food Lovers</h1>
        <p className="section-subtitle">
          Real dining experiences and ratings from our cherished Dublin community.
        </p>
      </div>

      {/* Rating Summary Card */}
      <div className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-8 mb-12 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Score */}
          <div className="md:col-span-4 text-center md:border-r border-[#EAEAEA] md:pr-8">
            <span className="text-5xl sm:text-6xl font-extrabold text-[#1A130E] block leading-none">
              4.9
            </span>
            <div className="flex items-center justify-center gap-1 my-2.5 text-[#D49B37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#D49B37]" />
              ))}
            </div>
            <p className="text-[13px] text-[#747474]">Based on 2,140+ verified customer reviews</p>
            <button
              onClick={() => setShowReviewModal(true)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white text-[13px] font-semibold shadow-sm hover:scale-105 active:scale-95 transition-all"
            >
              Write a Review
            </button>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-3.5">
            {[
              { aspect: 'Food Quality & Taste', score: '99%', val: '4.9/5' },
              { aspect: 'Spice Authenticity & Craft', score: '98%', val: '5.0/5' },
              { aspect: 'Delivery Speed & Temperature', score: '95%', val: '4.8/5' },
              { aspect: 'Packaging & Leakproof Seal', score: '97%', val: '4.9/5' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-[#1A130E]">{bar.aspect}</span>
                  <span className="text-[#747474] font-medium">{bar.val}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[rgb(249,249,249)] overflow-hidden border border-[#E5E5E5]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FBA138] to-[#F15A24] rounded-full transition-all duration-500"
                    style={{ width: bar.score }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterRating('all')}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
              filterRating === 'all'
                ? 'bg-[#B84A22] text-white shadow-sm'
                : 'bg-white text-[#555555] border border-[#E5E5E5]'
            }`}
          >
            All Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setFilterRating(5)}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
              filterRating === 5
                ? 'bg-[#B84A22] text-white shadow-sm'
                : 'bg-white text-[#555555] border border-[#E5E5E5]'
            }`}
          >
            <span>5 Stars Only</span>
            <Star className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="text-[13px] text-[#B84A22] font-semibold hover:underline flex items-center gap-1"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Add Your Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filtered.map((rev) => (
          <div key={rev.id} className="bg-white border border-[#E5E5E5] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B84A22] to-[#FBA138] text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[15px] text-[#1A130E] leading-snug">{rev.name}</h4>
                    <p className="text-[12px] text-[#747474]">{rev.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-[#D49B37]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D49B37]" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3.5">
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[rgb(249,249,249)] border border-[#E5E5E5] text-[#B84A22]">
                  Ordered: {rev.dish}
                </span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#0FA958] font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Order
                  </span>
                )}
              </div>

              <p className="text-[14px] sm:text-[15px] text-[#3D3D3D] leading-[24px] font-normal mb-4">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-3.5 border-t border-[#F0F0F0] flex items-center justify-between text-[12px] text-[#747474]">
              <span>{rev.date}</span>
              <button
                onClick={() => {
                  setReviewsList(
                    reviewsList.map((r) =>
                      r.id === rev.id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
                    )
                  );
                }}
                className="flex items-center gap-1.5 text-[#747474] hover:text-[#B84A22] transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div
          onClick={() => setShowReviewModal(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#E5E5E5] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[18px] sm:text-[20px] font-bold text-[#1A130E]">Write a Customer Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 text-[#555555] hover:text-[#1A130E] hover:bg-neutral-200/70 border border-[#E5E5E5] flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="e.g. David Kelly"
                  className="amber-input"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">
                  Dish Enjoyed
                </label>
                <input
                  type="text"
                  value={newReview.dish}
                  onChange={(e) => setNewReview({ ...newReview, dish: e.target.value })}
                  placeholder="e.g. Signature Dum Biryani"
                  className="amber-input"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating
                            ? 'fill-[#D49B37] text-[#D49B37]'
                            : 'text-[#D4D4D4]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#1A130E] mb-1">
                  Your Dining Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Tell others about the spices, delivery time, packaging, and flavors..."
                  className="amber-input resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold bg-white border border-[#E5E5E5] text-[#1A130E] hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-[13px] font-semibold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-xs hover:opacity-95 transition-opacity"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center p-8 sm:p-10 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
        <h3 className="font-bold text-[20px] text-[#1A130E] mb-2">Ready to Taste the Best of Dublin?</h3>
        <p className="text-[14px] text-[#555555] max-w-md mx-auto mb-6">
          Join thousands of satisfied diners enjoying authentic dum cooking and royal curries.
        </p>
        <Link
          href="/menu"
          className="px-8 py-3.5 rounded-xl text-[14px] font-bold bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white shadow-md hover:scale-[1.01] active:scale-98 inline-flex items-center gap-2 transition-all"
        >
          <span>Order From Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
