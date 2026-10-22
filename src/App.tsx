import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { config } from "./constants/config";
import { Navbar } from "./components";
import Home from "./pages/Home";
import BookProjectPage from "./pages/BookProjectPage";
import NotFound from "./pages/NotFound";

const App = () => {
  useEffect(() => {
    if (document.title !== config.html.title) {
      document.title = config.html.title;
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="agency-theme relative z-0">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-project" element={<BookProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
