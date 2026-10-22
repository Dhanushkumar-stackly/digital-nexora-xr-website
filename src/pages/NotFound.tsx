import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Suspense, lazy } from "react";
const StarsCanvas = lazy(() => import("../components/canvas/Stars"));

const NotFound = () => {
  return (
    <div className="relative min-h-screen">
      {/* Stars Background */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <StarsCanvas />
        </div>
      </Suspense>

      {/* 404 Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Number */}
          <motion.h1
            className="text-[150px] sm:text-[200px] md:text-[250px] font-black leading-none mb-4"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              background: "linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 30px rgba(255, 153, 51, 0.5)",
            }}
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Go to Home
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-150"></div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
