import { useTranslation } from "react-i18next";
import type { Review } from "@/types/booking";

interface PropertyReviewsProps {
  reviews: Review[];
  averageRating: number | null;
}

export function PropertyReviews({ reviews, averageRating }: PropertyReviewsProps) {
  const { t } = useTranslation("housing");

  return (
    <section className="vehicle-detail-section">
      <div className="vehicle-reviews__header">
        <h2>{t("reviews.title")}</h2>
        {averageRating !== null && (
          <span className="vehicle-reviews__average">
            ★ {averageRating.toFixed(1)} · {reviews.length}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="vehicle-detail-section__text">{t("reviews.empty")}</p>
      ) : (
        <div className="vehicle-reviews__list">
          {reviews.map((review) => (
            <div key={review.id} className="vehicle-review-card glass-surface">
              <div className="vehicle-review-card__header">
                <span className="vehicle-review-card__user">{review.user}</span>
                <span className="vehicle-review-card__rating">★ {review.rating}</span>
              </div>
              {review.comment && <p>{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
