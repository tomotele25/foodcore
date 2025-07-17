"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const ReviewSection = ({ vendorId, userId }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRating = (star) => {
    setRating(star);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText || !rating)
      return alert("Please enter a review and rating.");

    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          userId,
          review: reviewText,
          rating,
        }),
      });
      alert("Review submitted!");
      setReviewText("");
      setRating(0);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-gray-100 max-w-xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Leave a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={24}
              onClick={() => handleRating(star)}
              className={`cursor-pointer ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={star <= rating ? "currentColor" : "none"}
            />
          ))}
        </div>

        {/* Review Text */}
        <textarea
          rows={4}
          className="w-full border border-gray-300 p-2 rounded-md text-sm resize-none"
          placeholder="Write your experience here..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="bg-[#AE2108] hover:bg-[#911c06] transition text-white px-4 py-2 rounded-md text-sm"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewSection;
