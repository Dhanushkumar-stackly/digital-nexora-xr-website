type TSection = {
  p: string;
  h2: string;
  content?: string;
};

type TConfig = {
  html: {
    title: string;
    fullName: string;
    email: string;
  };
  hero: {
    name: string;
    p: string[];
  };
  contact: {
    form: {
      name: {
        span: string;
        placeholder: string;
      };
      email: {
        span: string;
        placeholder: string;
      };
      message: {
        span: string;
        placeholder: string;
      };
    };
  } & TSection;
  sections: {
    about: Required<TSection>;
    experience: TSection;
    digitalMarketing: Required<TSection>;
    works: Required<TSection>;
    feedbacks: Required<TSection>;
  };
};

export const config: TConfig = {
  html: {
    title: "Digital Nexora XR Webtech | DNX",
    fullName: "Digital Nexora XR Webtech",
    email: "digitalnexorawebtech0401@gmail.com",
  },
  hero: {
    name: "DNX - DIGITAL NEXORAXR WEBTECH",
    p: ["Create. Connect. Convert"],
  },
  contact: {
    p: "Get in touch",
    h2: "Contact.",
    form: {
      name: {
        span: "Your Name",
        placeholder: "What's your name?",
      },
      email: { span: "Your Email", placeholder: "What's your email?" },
      message: {
        span: "Your Message",
        placeholder: "What do you want to say?",
      },
    },
  },
  sections: {
    about: {
      p: "",
      h2: "",
      content: ``,
    },
    experience: {
      p: "What I have done so far",
      h2: "Work Experience.",
    },
    digitalMarketing: {
      p: "Digital Solutions",
      h2: "Digital Marketing.",
      content: `Comprehensive digital marketing services combining AI-driven strategies with cutting-edge web technologies. From SEO optimization and social media management to content marketing and analytics, we deliver data-driven campaigns that drive engagement and conversions. Our expertise in modern web frameworks ensures seamless integration of marketing tools and tracking systems for measurable results.`,
    },
    works: {
      p: "Advanced Projects",
      h2: "Projects.",
      content: `The following advanced projects showcase my expertise in AI, computer vision, IoT, and full-stack development. Each project demonstrates real-world applications of cutting-edge technologies, from machine learning models to 3D interactive experiences. These projects reflect my ability to solve complex technical challenges and deliver innovative solutions across diverse domains.`,
    },
    feedbacks: {
      p: "What others say",
      h2: "Testimonials.",
      content: `Hear from our satisfied clients and partners about their experience working with DNX - Digital Nexora XR WebTech. We pride ourselves on delivering exceptional results and building lasting relationships through innovation, professionalism, and dedication to excellence.`,
    },
  },
};
