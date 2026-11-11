import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICES = [
  "SEO Optimization",
  "Social Media Management",
  "Website Development",
  "Digital Marketing Strategy",
  "Other",
];

const BUDGETS = ["<$5k", "$5k-$15k", "$15k-$50k", "$50k+"];

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    phone: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit consultation request");
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: "",
          businessName: "",
          phone: "",
          email: "",
          service: "",
          budget: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#02060f]/75 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Free consultation request"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="surface-card pointer-events-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto p-6 shadow-2xl sm:p-8"
          >
            {submitted ? (
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#142d52]">
                    <svg className="h-8 w-8 text-[#60a5fa]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Thank you!</h3>
                <p className="mt-2 text-sm text-[#cbd5e1]">
                  We've received your consultation request. We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Free Consultation</h2>
                  <button
                    onClick={onClose}
                    className="text-xl text-[#94a3b8] hover:text-white"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label block">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="form-label block">Business Name *</label>
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                        placeholder="Your business"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label block">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="form-label block">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="form-label block">Service *</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                      >
                        <option value="">Select a service</option>
                        {SERVICES.map((svc) => (
                          <option key={svc} value={svc}>
                            {svc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="form-label block">Budget *</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        className="form-field mt-1"
                      >
                        <option value="">Select budget</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label block">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="form-field mt-1"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  {error && <div className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="agency-button-primary w-full"
                  >
                    {loading ? "Sending..." : "Request Consultation"}
                  </button>

                  <p className="text-center text-xs text-[#94a3b8]">
                    We respect your privacy. Read our{" "}
                    <a href="#" className="underline hover:text-white">
                      privacy policy
                    </a>
                    .
                  </p>
                </form>
              </>
            )}
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
