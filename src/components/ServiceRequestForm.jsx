import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const categories = ['CCTV', 'Fire Alarm', 'Security Alarm', 'Electrical', 'Plumbing', 'Air Conditioning'];
const timeSlotOptions = [
  { value: '09:00', label: 'Morning (9 AM – 12 PM)' },
  { value: '12:00', label: 'Afternoon (12 PM – 3 PM)' },
  { value: '15:00', label: 'Evening (3 PM – 6 PM)' },
];
const MAX_IMAGES = 5;

const ServiceRequestForm = ({ category, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    category: category || '',
    description: '',
    preferredDate: '',
    preferredTimeSlot: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (category) {
      setFormData((prev) => ({ ...prev, category }));
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      const limitedFiles = files.slice(0, MAX_IMAGES);
      setImages(limitedFiles);
      createPreviews(limitedFiles);
      return;
    }
    setImages(files);
    createPreviews(files);
    setError('');
  };

  const createPreviews = (files) => {
    if (files.length === 0) {
      setImagePreviews([]);
      return;
    }
    
    const previews = [];
    let loadedCount = 0;
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews[index] = { file, preview: reader.result };
        loadedCount++;
        if (loadedCount === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.category || !formData.description) {
      setError('Category and description are required.');
      setLoading(false);
      return;
    }

    if (!formData.preferredDate || !formData.preferredTimeSlot) {
      setError('Preferred visit date and time slot are required.');
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      payload.append('category', formData.category);
      payload.append('title', `${formData.category || 'Service'} service request`);
      payload.append('description', formData.description.trim());

      const preferredDateTime = `${formData.preferredDate}T${formData.preferredTimeSlot}`;
      payload.append('preferredVisitAt', new Date(preferredDateTime).toISOString());

      images.forEach((image) => {
        payload.append('images', image);
      });

      // Start the API call but don't wait for it to complete
      const submitPromise = api.post('/service-requests', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Wait for 2 seconds minimum, then show success
      await Promise.all([
        submitPromise,
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);

      setFormData({
        category: category || '',
        description: '',
        preferredDate: '',
        preferredTimeSlot: '',
      });
      setImages([]);
      setImagePreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSuccess?.();
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create service request. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); 
    return now.toISOString().slice(0, 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-500 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={onCancel}
          className="mb-4 text-white hover:text-blue-100 font-medium"
        >
          ← Back to dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Request a New Service</h2>
          <p className="text-gray-600 mb-6">
            Enter your details below for a new installation or service. We’ll review it and get back to you soon.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Category <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Selected based on your dashboard choice</p>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
                disabled={Boolean(category)}
              >
                <option value="">-- Please select a category --</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Describe what service you need in detail. Include any specific requirements, location details, or special instructions."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Preferred Visit Date <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-gray-800 shadow-sm hover:border-blue-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                    </svg>
                    Preferred Time Slot <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="preferredTimeSlot"
                  value={formData.preferredTimeSlot}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-gray-800 shadow-sm hover:border-blue-400 transition-all"
                  required
                >
                  <option value="">Select a preferred slot</option>
                  {timeSlotOptions.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Installation Area Images <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                </span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Upload photos that show the installation area or existing setup to help us understand your request.</p>
              
              <div className="relative">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="mb-2 text-sm font-semibold text-gray-700">
                      <span className="text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Up to {MAX_IMAGES} images (JPG, PNG)
                    </p>
                  </div>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Selected Images ({imagePreviews.length}/{MAX_IMAGES}):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <p className="mt-1 text-xs text-gray-600 truncate px-1" title={preview.file.name}>
                          {preview.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-4">
                <span className="text-red-500">*</span> Required fields must be filled before submitting.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-semibold shadow-md hover:shadow-lg"
                >
                  {loading ? 'Submitting Request...' : 'Submit Service Request'}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;


