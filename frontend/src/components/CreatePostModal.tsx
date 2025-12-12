import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: any) => Promise<void>;
  userId: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit, userId }) => {
  const [formData, setFormData] = useState({
    user_id: userId,
    caption: '',
    images: [''],
    location_name: '',
    country: '',
    city: '',
    post_type: 'experience',
    category: 'travel',
    tags: [] as string[],
    experience_rating: 5,
    booking_info: {
      price: '',
      booking_url: '',
      affiliate_code: ''
    }
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Clean up the data before submitting
      const submitData = {
        ...formData,
        images: formData.images.filter(img => img.trim() !== ''),
        booking_info: formData.booking_info.price || formData.booking_info.booking_url || formData.booking_info.affiliate_code
          ? formData.booking_info
          : undefined
      };

      await onSubmit(submitData);
      
      // Reset form
      setFormData({
        user_id: userId,
        caption: '',
        images: [''],
        location_name: '',
        country: '',
        city: '',
        post_type: 'experience',
        category: 'travel',
        tags: [],
        experience_rating: 5,
        booking_info: {
          price: '',
          booking_url: '',
          affiliate_code: ''
        }
      });
      setTagInput('');
    } catch (error) {
      console.error('Error in modal submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const handleAddImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, '']
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages.length > 0 ? newImages : ['']
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full my-8">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Create Travel Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Image URLs</label>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  required={index === 0}
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddImage}
              className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
            >
              Add Another Image
            </button>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Caption</label>
            <textarea
              required
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              rows={4}
              placeholder="Tell us about your travel experience..."
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Location Name</label>
              <input
                type="text"
                required
                value={formData.location_name}
                onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g., Eiffel Tower"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g., Paris"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g., France"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-2 text-white"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Experience Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.experience_rating}
              onChange={(e) => setFormData({ ...formData, experience_rating: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Booking Info */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">Booking Info (Optional)</label>
            <input
              type="text"
              value={formData.booking_info.price}
              onChange={(e) => setFormData({
                ...formData,
                booking_info: { ...formData.booking_info, price: e.target.value }
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Price (e.g., $99)"
            />
            <input
              type="url"
              value={formData.booking_info.booking_url}
              onChange={(e) => setFormData({
                ...formData,
                booking_info: { ...formData.booking_info, booking_url: e.target.value }
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Booking URL"
            />
            <input
              type="text"
              value={formData.booking_info.affiliate_code}
              onChange={(e) => setFormData({
                ...formData,
                booking_info: { ...formData.booking_info, affiliate_code: e.target.value }
              })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="Affiliate Code"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 sticky bottom-0 bg-gray-800 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium disabled:opacity-50 transition-colors"
              disabled={isSubmitting}
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
