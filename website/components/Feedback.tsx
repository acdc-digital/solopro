// FEEDBACK COMPONENT
// /Users/matthewsimon/Documents/Github/solopro/website/components/Feedback.tsx

"use client";

import React, { useState } from "react";
import { X, Send, Star, MessageSquare } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useConvexUser } from "../lib/hooks/useConvexUser";

interface FeedbackModalProps {
  children: React.ReactNode;
}

export function FeedbackModal({ children }: FeedbackModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    overallRating: 0,
    mostValuableFeature: "",
    leastValuableFeature: "",
    easeOfUse: 0,
    dataAccuracy: 0,
    helpfulnessLevel: 0,
    improvementSuggestions: "",
    featureRequests: "",
    privacyConcerns: "",
    recommendToFriend: 0,
    additionalComments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user authentication state and mutation
  const { userId, isAuthenticated } = useConvexUser();
  const submitUserFeedback = useMutation(api.feedback.submitUserFeedback);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSubmitSuccess(false);
    setError(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStarRating = (field: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: rating
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Feedback submitted:", formData);
      
      // Call the Convex mutation
      await submitUserFeedback({
        userId: isAuthenticated ? userId : undefined,
        email: formData.email || undefined,
        overallRating: formData.overallRating,
        mostValuableFeature: formData.mostValuableFeature || undefined,
        leastValuableFeature: formData.leastValuableFeature || undefined,
        easeOfUse: formData.easeOfUse,
        dataAccuracy: formData.dataAccuracy,
        helpfulnessLevel: formData.helpfulnessLevel,
        improvementSuggestions: formData.improvementSuggestions || undefined,
        featureRequests: formData.featureRequests || undefined,
        privacyConcerns: formData.privacyConcerns || undefined,
        recommendToFriend: formData.recommendToFriend,
        additionalComments: formData.additionalComments || undefined,
      });
      
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          email: "",
          overallRating: 0,
          mostValuableFeature: "",
          leastValuableFeature: "",
          easeOfUse: 0,
          dataAccuracy: 0,
          helpfulnessLevel: 0,
          improvementSuggestions: "",
          featureRequests: "",
          privacyConcerns: "",
          recommendToFriend: 0,
          additionalComments: ""
        });
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      setError(error instanceof Error ? error.message : "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              title={`Rate ${star} star${star > 1 ? 's' : ''}`}
              className={`p-1 transition-colors ${
                star <= rating ? "text-yellow-400" : "text-gray-300 hover:text-yellow-200"
              }`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <span onClick={openModal} className="cursor-pointer">
        {children}
      </span>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
        onClick={closeModal}
      />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">Share Your Feedback</h2>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close feedback modal"
            title="Close feedback modal"
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your feedback!</h3>
              <p className="text-gray-600">Your insights help us improve Soloist for everyone.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-600 text-sm">
                Your feedback helps us improve Soloist and create better mood tracking experiences. All responses are anonymous unless you choose to provide your email.
              </p>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional - for follow-up questions)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Overall Rating */}
              <StarRating
                rating={formData.overallRating}
                onRatingChange={(rating) => handleStarRating("overallRating", rating)}
                label="Overall satisfaction with Soloist *"
              />

              {/* Feature Value Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Most valuable feature
                  </label>
                  <select
                    value={formData.mostValuableFeature}
                    onChange={(e) => handleInputChange("mostValuableFeature", e.target.value)}
                    aria-label="Most valuable feature"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a feature</option>
                    <option value="mood-tracking">Daily mood tracking</option>
                    <option value="ai-insights">AI-powered insights</option>
                    <option value="mood-forecasting">Mood forecasting</option>
                    <option value="data-visualization">Data visualization</option>
                    <option value="pattern-recognition">Pattern recognition</option>
                    <option value="goal-setting">Goal setting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Least valuable feature
                  </label>
                  <select
                    value={formData.leastValuableFeature}
                    onChange={(e) => handleInputChange("leastValuableFeature", e.target.value)}
                    aria-label="Least valuable feature"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">Select a feature</option>
                    <option value="mood-tracking">Daily mood tracking</option>
                    <option value="ai-insights">AI-powered insights</option>
                    <option value="mood-forecasting">Mood forecasting</option>
                    <option value="data-visualization">Data visualization</option>
                    <option value="pattern-recognition">Pattern recognition</option>
                    <option value="goal-setting">Goal setting</option>
                    <option value="none">All features are valuable</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Rating Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StarRating
                  rating={formData.easeOfUse}
                  onRatingChange={(rating) => handleStarRating("easeOfUse", rating)}
                  label="Ease of use *"
                />

                <StarRating
                  rating={formData.dataAccuracy}
                  onRatingChange={(rating) => handleStarRating("dataAccuracy", rating)}
                  label="Accuracy of insights *"
                />

                <StarRating
                  rating={formData.helpfulnessLevel}
                  onRatingChange={(rating) => handleStarRating("helpfulnessLevel", rating)}
                  label="How helpful is Soloist? *"
                />

                <StarRating
                  rating={formData.recommendToFriend}
                  onRatingChange={(rating) => handleStarRating("recommendToFriend", rating)}
                  label="Recommend to a friend? *"
                />
              </div>

              {/* Text Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How can we improve Soloist?
                </label>
                <textarea
                  value={formData.improvementSuggestions}
                  onChange={(e) => handleInputChange("improvementSuggestions", e.target.value)}
                  placeholder="Share your ideas for improvements..."
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feature requests
                </label>
                <textarea
                  value={formData.featureRequests}
                  onChange={(e) => handleInputChange("featureRequests", e.target.value)}
                  placeholder="What features would you like to see?"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Privacy or data concerns
                </label>
                <textarea
                  value={formData.privacyConcerns}
                  onChange={(e) => handleInputChange("privacyConcerns", e.target.value)}
                  placeholder="Any concerns about how your data is handled?"
                  rows={2}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional comments
                </label>
                <textarea
                  value={formData.additionalComments}
                  onChange={(e) => handleInputChange("additionalComments", e.target.value)}
                  placeholder="Anything else you'd like to share?"
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || formData.overallRating === 0}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

