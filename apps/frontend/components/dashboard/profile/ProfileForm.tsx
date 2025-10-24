"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types/dashboard/profile/types";
import ProfileSection from "./ProfileSection";

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export default function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('socialLinks.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <ProfileSection title="Personal Information" description="Update your basic personal details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
              I am a *
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="alumni">Alumni</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </ProfileSection>

      {/* Education Information */}
      <ProfileSection title="Education Information" description="Tell us about your educational background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
              Institution *
            </label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                errors.institution ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., University of Mianwali"
            />
            {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
          </div>

          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
              Course/Program
            </label>
            <input
              type="text"
              id="course"
              name="course"
              value={formData.course || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="e.g., Computer Science"
            />
          </div>

          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
              Semester/Year
            </label>
            <input
              type="text"
              id="semester"
              name="semester"
              value={formData.semester || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="e.g., 5th Semester"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Mianwali, Pakistan"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
        </div>
      </ProfileSection>

      {/* Bio */}
      <ProfileSection title="About Me" description="Write a short bio to introduce yourself to other students">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500 resize-none"
            placeholder="Tell other students about yourself, your interests, or what you're studying..."
          />
        </div>
      </ProfileSection>

      {/* Notification Preferences */}
      <ProfileSection title="Notification Preferences" description="Choose how you want to receive notifications">
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="preferences.emailNotifications"
              checked={formData.preferences.emailNotifications}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-eco-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Email Notifications</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="preferences.smsNotifications"
              checked={formData.preferences.smsNotifications}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-eco-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">SMS Notifications</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="preferences.priceDropAlerts"
              checked={formData.preferences.priceDropAlerts}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-eco-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Price Drop Alerts</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="preferences.nearbyItemAlerts"
              checked={formData.preferences.nearbyItemAlerts}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 focus:ring-eco-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Nearby Item Alerts</span>
          </label>
        </div>
      </ProfileSection>

      {/* Social Links */}
      <ProfileSection title="Social Links" description="Connect your social media profiles (optional)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-700 mb-2">
              Facebook
            </label>
            <input
              type="url"
              id="socialLinks.facebook"
              name="socialLinks.facebook"
              value={formData.socialLinks?.facebook || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="https://facebook.com/username"
            />
          </div>

          <div>
            <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              id="socialLinks.twitter"
              name="socialLinks.twitter"
              value={formData.socialLinks?.twitter || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              id="socialLinks.instagram"
              name="socialLinks.instagram"
              value={formData.socialLinks?.instagram || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              id="socialLinks.linkedin"
              name="socialLinks.linkedin"
              value={formData.socialLinks?.linkedin || ''}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-eco-500"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>
      </ProfileSection>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition-colors shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}