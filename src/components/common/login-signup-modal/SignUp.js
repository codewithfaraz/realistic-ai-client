"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SignUp = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(formData);
      // Close the modal if Bootstrap is available
      if (typeof window !== "undefined") {
        try {
          const bootstrap = await import("bootstrap");
          const modalEl = document.getElementById("loginSignupModal");
          if (modalEl) {
            const bsModal =
              bootstrap.Modal.getInstance(modalEl) ||
              new bootstrap.Modal(modalEl);
            bsModal.hide();
          }
        } catch {
          // Fallback: click the close button
          const closeBtn = document.querySelector(
            '#loginSignupModal .btn-close',
          );
          if (closeBtn) closeBtn.click();
        }
        window.location.reload();
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-style1" onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger fz14 mb15" role="alert">
          {error}
        </div>
      )}

      <div className="mb25">
        <label className="form-label fw600 dark-color">Email</label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      {/* End Email */}

      <div className="mb20">
        <label className="form-label fw600 dark-color">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb20">
        <label className="form-label fw600 dark-color">First Name</label>
        <input
          type="text"
          name="firstName"
          className="form-control"
          placeholder="Enter First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb20">
        <label className="form-label fw600 dark-color">Last Name</label>
        <input
          type="text"
          name="lastName"
          className="form-control"
          placeholder="Enter Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb20">
        <label className="form-label fw600 dark-color">Phone No.</label>
        <input
          type="tel"
          name="phone"
          className="form-control"
          placeholder="Enter Phone No."
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      {/* End Password */}

      <div className="d-grid mb20">
        <button className="ud-btn btn-thm" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              />
              Creating account...
            </>
          ) : (
            <>
              Create account <i className="fal fa-arrow-right-long" />
            </>
          )}
        </button>
      </div>

      <p className="dark-color text-center mb0 mt10">
        Already Have an Account?{" "}
        <Link className="dark-color fw600" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignUp;
