"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProfileService } from "@/services/profile.service";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "",
    address: "",
    aboutMe: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ProfileService.getProfile();
        if (response?.success && response?.data) {
          const profile = response.data;
          setFormData({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            language: profile.language || "",
            address: profile.address || "",
            aboutMe: profile.aboutMe || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await ProfileService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        language: formData.language,
        address: formData.address,
        aboutMe: formData.aboutMe,
        // Typically email isn't directly updatable without verification, but we include it if API allows
      });

      if (response?.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response?.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred while updating."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Your Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-sm-6 col-xl-4">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Language
            </label>
            <input
              type="text"
              name="language"
              className="form-control"
              placeholder="E.g. English, French"
              value={formData.language}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-xl-12">
          <div className="mb20">
            <label className="heading-color ff-heading fw600 mb10">
              Address
            </label>
            <input
              type="text"
              name="address"
              className="form-control"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="mb10">
            <label className="heading-color ff-heading fw600 mb10">
              About me
            </label>
            <textarea
              name="aboutMe"
              cols={30}
              rows={4}
              placeholder="Tell us about yourself..."
              value={formData.aboutMe}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-md-12">
          <div className="text-end">
            <button
              type="submit"
              className="ud-btn btn-dark"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
              {!isUpdating && <i className="fal fa-arrow-right-long" />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PersonalInfo;
