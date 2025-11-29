import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { SearchProvider } from './context/SearchContext';
import { NotificationProvider } from './context/NotificationContext';

import Overview from './pages/Overview';
import Waste from './pages/Waste';
import Emissions from './pages/Emissions';
import Energy from './pages/Energy';
import Water from './pages/Water';
import CommunityGrid from './pages/CommunityGrid';
import About from './pages/About';

import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <SearchProvider>
            <NotificationProvider>
              <Layout />
            </NotificationProvider>
          </SearchProvider>
        }>
          <Route index element={<Overview />} />
          <Route path="waste" element={<Waste />} />
          <Route path="emissions" element={<Emissions />} />
          <Route path="energy" element={<Energy />} />
          <Route path="water" element={<Water />} />
          <Route path="grid" element={<CommunityGrid />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
