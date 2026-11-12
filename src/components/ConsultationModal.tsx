import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { consultationBudgets, consultationServices } from '../constants/consultation';

// Absolute so the static Hostinger copy of the site still reaches the Vercel function.
const CONSULTATION_API = 'https://digital-nexora-xr-website-ten.vercel.app/api/consultation';

interface ConsultationModalProps {
  isOpen: boolean;
  topic?: string;
  onClose: () => void;
}

const EMPTY_FORM = {
  name: '',
  businessName: '',
  email: '',
  phone: '',
  service: '',
  budget: '',
  message: '',
};

type FormData = typeof EMPTY_FORM;
type FieldErrors = Partial<Record<keyof FormData, string>>;

// Fallback when email can't be sent: hand the visitor's details to WhatsApp so the enquiry isn't lost.
const whatsappUrl = (data: FormData) => {
  const lines = [
    'Hello HD NEXORA WEBTEC, I would like a free consultation.',
    '',
    `Name: ${data.name}`,
    `Business: ${data.businessName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service: ${data.service}`,
    `Budget: ${data.budget}`,
    data.message ? `Message: ${data.message}` : '',
  ].filter((line, i) => i < 2 || !/:\s*$/.test(line));
  return `https://wa.me/919943711466?text=${encodeURIComponent(lines.join('\n').trim())}`;
};

export default function ConsultationModal({ isOpen, topic, onClose }: ConsultationModalProps) {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const startedAt = useRef(0);
  const submitting = useRef(false);
  const firstField = useRef<HTMLInputElement>(null);

  // Replace a message we filled in earlier, but never one the visitor typed.
  const autoMessage = useRef('');
  useEffect(() => {
    if (!isOpen || !topic) return;
    const previous = autoMessage.current;
    const next = `I'm interested in ${topic}.`;
    autoMessage.current = next;
    setFormData(prev =>
      !prev.message || prev.message === previous ? { ...prev, message: next } : prev
    );
  }, [isOpen, topic]);

  useEffect(() => {
    if (!isOpen) return;
    startedAt.current = Date.now();
    const focusTimer = window.setTimeout(() => firstField.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const handleClose = () => {
    if (reference) {
      setFormData(EMPTY_FORM);
      autoMessage.current = '';
      setReference(null);
    }
    setError(null);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // A ref, not state: two fast clicks both run before React re-renders.
    if (submitting.current) return;
    submitting.current = true;
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch(CONSULTATION_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website, fillMs: Date.now() - startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFieldErrors(data.errors ?? {});
        setError(
          data.message ??
            "We couldn't send your request. Please try again or contact us on WhatsApp."
        );
        return;
      }
      setReference(data.reference ?? '');
    } catch {
      setError(
        "We couldn't reach our server. Please check your connection, or contact us on WhatsApp."
      );
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  const fieldProps = (name: keyof FormData) => ({
    id: `consult-${name}`,
    name,
    value: formData[name],
    onChange: handleChange,
    className: `form-field mt-1 ${fieldErrors[name] ? 'border-red-400' : ''}`,
    'aria-invalid': fieldErrors[name] ? true : undefined,
    'aria-describedby': fieldErrors[name] ? `consult-${name}-error` : undefined,
  });

  const fieldError = (name: keyof FormData) =>
    fieldErrors[name] ? (
      <p id={`consult-${name}-error`} className="mt-1 text-sm text-red-300">
        {fieldErrors[name]}
      </p>
    ) : null;

  // No exit animation: unmounting immediately guarantees nothing invisible is left covering the page.
  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-[#020a14]/75 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consult-title"
            initial={{ scale: 0.96, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            className="surface-card relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <h2 id="consult-title" className="text-2xl font-bold text-white">
                {reference !== null ? 'Request received' : 'Book a Free Consultation'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-xl text-[#8fa1b8] hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {reference !== null ? (
              <div className="text-center">
                <p className="text-[#c3cddb]">
                  Thank you. We&apos;ve received your consultation request and will be in touch
                  soon. A confirmation has been sent to your email.
                </p>
                {reference && (
                  <p className="mt-4 text-sm text-[#8fa1b8]">Your reference: {reference}</p>
                )}
                <button type="button" onClick={handleClose} className="agency-button-primary mt-6">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="consult-name" className="form-label block">
                      Name *
                    </label>
                    <input
                      {...fieldProps('name')}
                      ref={firstField}
                      type="text"
                      autoComplete="name"
                      required
                      maxLength={100}
                    />
                    {fieldError('name')}
                  </div>
                  <div>
                    <label htmlFor="consult-businessName" className="form-label block">
                      Business Name *
                    </label>
                    <input
                      {...fieldProps('businessName')}
                      type="text"
                      autoComplete="organization"
                      required
                      maxLength={120}
                    />
                    {fieldError('businessName')}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="consult-phone" className="form-label block">
                      Phone *
                    </label>
                    <input
                      {...fieldProps('phone')}
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={25}
                      placeholder="+91 98765 43210"
                    />
                    {fieldError('phone')}
                  </div>
                  <div>
                    <label htmlFor="consult-email" className="form-label block">
                      Email *
                    </label>
                    <input
                      {...fieldProps('email')}
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                    />
                    {fieldError('email')}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="consult-service" className="form-label block">
                      Service *
                    </label>
                    <select {...fieldProps('service')} required>
                      <option value="">Select a service</option>
                      {consultationServices.map(service => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                    {fieldError('service')}
                  </div>
                  <div>
                    <label htmlFor="consult-budget" className="form-label block">
                      Budget *
                    </label>
                    <select {...fieldProps('budget')} required>
                      <option value="">Select a budget</option>
                      {consultationBudgets.map(budget => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                    {fieldError('budget')}
                  </div>
                </div>

                <div>
                  <label htmlFor="consult-message" className="form-label block">
                    Message
                  </label>
                  <textarea
                    {...fieldProps('message')}
                    rows={3}
                    maxLength={2000}
                    placeholder="Tell us about your business and goals"
                  />
                </div>

                {/* Hidden from people; bots that fill it are ignored by the server. */}
                <div
                  className="absolute -left-[9999px] h-px w-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="consult-website">Website</label>
                  <input
                    id="consult-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300"
                  >
                    {error}{' '}
                    <a
                      href={whatsappUrl(formData)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      Send these details on WhatsApp →
                    </a>
                  </div>
                )}

                <button type="submit" disabled={loading} className="agency-button-primary w-full">
                  {loading ? 'Sending…' : 'Request Consultation'}
                </button>

                <p className="text-center text-xs leading-relaxed text-[#8fa1b8]">
                  We use these details only to respond to your enquiry and discuss our services. See
                  our{' '}
                  <Link
                    to="/privacy-policy"
                    onClick={handleClose}
                    className="underline hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
