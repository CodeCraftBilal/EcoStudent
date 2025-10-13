import { Star, Verified } from "lucide-react";

interface Review {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

interface ProductReviewsProps {
  reviews: Review[];
}

export default function ProductReviews({ reviews }: ProductReviewsProps) {
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        <div className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-600">({reviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex items-start space-x-4 mb-3">
              <img
                src={review.user.avatar}
                alt={review.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {review.user.name}
                  </span>
                  {review.user.verified && (
                    <Verified className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{review.comment}</p>
            <button className="text-sm text-gray-500 hover:text-green-600 transition-colors">
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}