class ReviewService {
  static REVIEWS_KEY = 'product_reviews';

  static async getAllReviews() {
    return new Promise((resolve) => {
      const reviews = JSON.parse(localStorage.getItem(this.REVIEWS_KEY) || '[]');
      resolve(reviews);
    });
  }

  static async saveReviews(reviews) {
    return new Promise((resolve) => {
      localStorage.setItem(this.REVIEWS_KEY, JSON.stringify(reviews));
      resolve(reviews);
    });
  }

  static async getApprovedReviewsForProduct(productId) {
    return new Promise(async (resolve) => {
      const reviews = await this.getAllReviews();
      const productReviews = reviews.filter(r => r.productId === productId && r.status === 'approved');
      resolve(productReviews);
    });
  }

  static async submitReview(reviewData) {
    return new Promise(async (resolve) => {
      const reviews = await this.getAllReviews();
      const newReview = {
        id: 'REV' + Date.now(),
        ...reviewData,
        status: 'pending', // Requires admin approval
        date: new Date().toISOString()
      };
      reviews.push(newReview);
      await this.saveReviews(reviews);
      resolve(newReview);
    });
  }

  static async updateReviewStatus(reviewId, status) {
    return new Promise(async (resolve) => {
      const reviews = await this.getAllReviews();
      const updated = reviews.map(r => r.id === reviewId ? { ...r, status } : r);
      await this.saveReviews(updated);
      resolve(updated);
    });
  }

  static async deleteReview(reviewId) {
    return new Promise(async (resolve) => {
      const reviews = await this.getAllReviews();
      const updated = reviews.filter(r => r.id !== reviewId);
      await this.saveReviews(updated);
      resolve(updated);
    });
  }
}

export default ReviewService;
