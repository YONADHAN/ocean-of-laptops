import { Route, Routes } from 'react-router-dom';
// import Xyz from '../components/AdminComponents/Products/xyz'
import LandingPage from '../components/PublicPages/LandingPage';
import Error404Page from '../pages/others/Error404';
import About from '../components/PublicPages/AboutPage';

const PublicRoutes = () => {
  return (
    <Routes>
      {/* Landing Page Route */}
      <Route path="/" element={<LandingPage />} />

      {/* About Page Route */}
      <Route path="/about" element={<About />} />


      {/* <Route path="/xyz" element={<Xyz />} /> */}

      {/* Catch-All Route for 404 Errors */}
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default PublicRoutes;
