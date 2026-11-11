import { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../../constants/styles";
import { slideIn, textVariant } from "../../utils/motion";
import { SectionWrapper } from "../../hoc";
import { EarthCanvas } from "../canvas";
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

interface FormData {
  projectName: string;
  organizationName: string;
  projectType: "website" | "marketing" | "both" | "";
  websiteType: string | null;
  marketingType: string | null;
  purpose: string;
  name: string;
  email: string;
  phone: string;
  additionalInfo: string;
}

const BookProject = () => {
  const developerEmail = import.meta.env.VITE_DEVELOPER_EMAIL;
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    organizationName: "",
    projectType: "",
    websiteType: null,
    marketingType: null,
    purpose: "",
    name: "",
    email: "",
    phone: "",
    additionalInfo: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle project type change with conditional reset
    if (name === "projectType") {
      setFormData(prev => ({
        ...prev,
        projectType: value as FormData["projectType"],
        // Reset website/marketing types when switching project type
        websiteType: value === "marketing" ? null : prev.websiteType,
        marketingType: value === "website" ? null : prev.marketingType,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const sendProjectEmail = async (formData: FormData) => {
    try {
      // Check EmailJS configuration
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Format the message content
      const emailContent = `
Subject: New Project Booking: ${formData.projectName}

Project Details:
---------------
Project Name: ${formData.projectName}
Organization/Company: ${formData.organizationName || 'Not provided'}
Project Type: ${formData.projectType}
${formData.websiteType ? `Website Type: ${formData.websiteType}` : ''}
${formData.marketingType ? `Marketing Type: ${formData.marketingType}` : ''}
Purpose: ${formData.purpose}

Client Information:
-----------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Additional Information:
---------------------
${formData.additionalInfo || 'No additional information provided'}
      `.trim();

      // Prepare template parameters
      const templateParams = {
        to_email: developerEmail,
        from_name: formData.name,
        from_email: formData.email,
        project_name: formData.projectName,
        organization_name: formData.organizationName,
        project_type: formData.projectType,
        website_type: formData.websiteType || 'N/A',
        marketing_type: formData.marketingType || 'N/A',
        purpose: formData.purpose,
        phone: formData.phone,
        additional_info: formData.additionalInfo,
        message: emailContent
      };

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is incomplete. Please check your environment variables.');
      }

      await emailjs.send(
        serviceId,
        templateId,
        templateParams
      );

      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Email sending failed: ${error.message}`);
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.projectName || !formData.projectType || !formData.purpose ||
          !formData.name || !formData.email || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Validate project-type specific fields
      if (formData.projectType === "website" && !formData.websiteType) {
        throw new Error('Please select a website type');
      }
      if (formData.projectType === "marketing" && !formData.marketingType) {
        throw new Error('Please select a marketing type');
      }
      if (formData.projectType === "both" && (!formData.websiteType || !formData.marketingType)) {
        throw new Error('Please select both website and marketing types');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Prepare clean payload
      const payload: FormData = {
        ...formData,
        websiteType: formData.projectType === "marketing" ? null : formData.websiteType,
        marketingType: formData.projectType === "website" ? null : formData.marketingType,
      };

      // Send email with project details
      await sendProjectEmail(payload);

      toast.success("Project booking request submitted successfully! We will contact you soon.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setFormData({
        projectName: "",
        organizationName: "",
        projectType: "",
        websiteType: null,
        marketingType: null,
        purpose: "",
        name: "",
        email: "",
        phone: "",
        additionalInfo: "",
      });
    } catch (error) {
      let errorMessage = "Failed to submit project booking request. ";

      if (error instanceof Error) {
        errorMessage += error.message;
      }

      alert(errorMessage + "\nPlease try again or contact support.");
    } finally {
      setLoading(false);
    }
  };

  const shouldShowWebsiteType = formData.projectType === "website" || formData.projectType === "both";
  const shouldShowMarketingType = formData.projectType === "marketing" || formData.projectType === "both";

  return (
    <div className="flex flex-col-reverse gap-10 overflow-hidden xl:mt-12 xl:flex-row">
      <ToastContainer theme="dark" />
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="surface-card flex-[0.75] p-6 sm:p-8"
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>Start Your Project</p>
          <h2 className={styles.sectionHeadText}>Book Your Project.</h2>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
          {/* Project Name */}
          <label className="flex flex-col">
            <span className="form-label">Project Name *</span>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              placeholder="What's your project called?"
              className="form-field"
            />
          </label>

          {/* Organization / Company Name */}
          <label className="flex flex-col">
            <span className="form-label">Organization / Company Name</span>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              placeholder="Your organization or company name (optional)"
              className="form-field"
            />
          </label>

          {/* Type of Project */}
          <label className="flex flex-col">
            <span className="form-label">Type of Project *</span>
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              required
              className="form-field"
            >
              <option value="">Select Project Type</option>
              <option value="website">Website</option>
              <option value="marketing">Marketing</option>
              <option value="both">Both</option>
            </select>
          </label>

          {/* Conditional: Types of Website */}
          {shouldShowWebsiteType && (
            <label className="flex flex-col">
              <span className="form-label">Types of Website *</span>
              <select
                name="websiteType"
                value={formData.websiteType || ""}
                onChange={handleChange}
                required
                className="form-field"
              >
                <option value="">Select Website Type</option>
                <option value="basic">Basic Website</option>
                <option value="professional">Professional Website</option>
                <option value="commercial">Commercial Website</option>
                <option value="ecommerce">E-Commerce Website</option>
                <option value="portfolio">Portfolio Website</option>
                <option value="blog">Blog/Content Website</option>
                <option value="custom">Custom Solution</option>
              </select>
            </label>
          )}

          {/* Conditional: Types of Marketing */}
          {shouldShowMarketingType && (
            <label className="flex flex-col">
              <span className="form-label">Types of Marketing *</span>
              <select
                name="marketingType"
                value={formData.marketingType || ""}
                onChange={handleChange}
                required
                className="form-field"
              >
                <option value="">Select Marketing Type</option>
                <option value="social-media">Social Media Management</option>
                <option value="digital-advertising">Digital Advertising</option>
                <option value="brand-strategy">Brand Strategy</option>
                <option value="search-optimization">Search Optimization</option>
                <option value="content-strategy">Content Strategy</option>
                <option value="digital-infrastructure">Digital Infrastructure</option>
              </select>
            </label>
          )}

          {/* Purpose */}
          <label className="flex flex-col">
            <span className="form-label">Purpose of Project *</span>
            <textarea
              rows={4}
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              placeholder="Describe the purpose and goals of your project..."
              className="form-field"
            />
          </label>

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="flex flex-col">
              <span className="form-label">Your Name *</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your full name"
                className="form-field"
              />
            </label>

            <label className="flex flex-col">
              <span className="form-label">Your Email *</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="form-field"
              />
            </label>
          </div>

          <label className="flex flex-col">
            <span className="form-label">Phone Number *</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1 (555) 123-4567"
              className="form-field"
            />
          </label>

          {/* Additional Info */}
          <label className="flex flex-col">
            <span className="form-label">Additional Information</span>
            <textarea
              rows={3}
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any specific requirements or features you need?"
              className="form-field"
            />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="agency-button-primary flex-1"
            >
              {loading ? "Submitting..." : "Book Your Project"}
            </button>
          </div>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="h-[350px] md:h-[550px] xl:h-auto xl:flex-1"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(BookProject, "bookproject");
