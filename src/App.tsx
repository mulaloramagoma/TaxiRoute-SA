import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import RoutesPage from '@/pages/RoutesPage';
import RouteDetails from '@/pages/RouteDetails';
import About from '@/pages/About';
import Report from '@/pages/Report';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:routeId" element={<RouteDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/report" element={<Report />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
