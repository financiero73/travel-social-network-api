import React, { useState } from 'react';
import { X, Upload, MapPin, Tag, DollarSign, Star } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<void>;
  userId: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, userId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    caption: '',
    imageUrl: '',
    locationName: '',
    country: '',
    city: '',
    postType: 'experience',
    category: 'adventure',
    tags: '',
    price: '',
    bookingUrl: '',
    experienceRating: 5,
  });

  if (!isOpen) return null;

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, imageUrl: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const postData = {
        user_id: userId,
        caption: formData.caption,
        images: [formData.imageUrl],
        location_name: formData.locationName,
        country: formData.country,
        city: formData.city || undefined,
        post_type: formData.postType,
        category: formData.category,
        tags: tagsArray,
        experience_rating: formData.experienceRating,
        booking_info: formData.price || formData.bookingUrl ? {
          price: formData.price || undefined,
          booking_url: formData.bookingUrl || undefined,
        } : undefined,
      };

      await onSubmit(postData);
      
      // Reset form
      setFormData({
        caption: '',
        imageUrl: '',
        locationName: '',
        country: '',
        city: '',
        postType: 'experience',
        category: 'adventure',
        tags: '',
        price: '',
        bookingUrl: '',
        experienceRating: 5,
      });
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 pb-24">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-cyan-400">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-800">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImagePreview('')}
              />
            </div>
          )}

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              <Upload className="w-4 h-4 inline mr-2" />
              Image URL *
            </label>
            <input
              type="url"
              required
              value={formData.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use an image URL from Unsplash, Imgur, or any hosting service
            </p>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Share your experience..."
              rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                <MapPin className="w-4 h-4 inline mr-2" />
                Country *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Spain"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Barcelona"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="Sagrada Familia"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Post Type and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Post Type *
              </label>
              <select
                value={formData.postType}
                onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="experience">Experience</option>
                <option value="accommodation">Accommodation</option>
                <option value="restaurant">Restaurant</option>
                <option value="activity">Activity</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="adventure">Adventure</option>
                <option value="wellness">Wellness</option>
                <option value="food">Food</option>
                <option value="culture">Culture</option>
                <option value="nature">Nature</option>
                <option value="beach">Beach</option>
                <option value="city">City</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              <Tag className="w-4 h-4 inline mr-2" />
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="travel, adventure, beach (comma separated)"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Experience Rating */}
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              <Star className="w-4 h-4 inline mr-2" />
              Experience Rating
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={formData.experienceRating}
                onChange={(e) => setFormData({ ...formData, experienceRating: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-cyan-400 font-bold text-lg w-12 text-center">
                {formData.experienceRating}
              </span>
            </div>
          </div>

          {/* Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Price
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="$50"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">
                Booking Link
              </label>
              <input
                type="url"
                value={formData.bookingUrl}
                onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                placeholder="https://booking.com/..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
