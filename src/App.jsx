import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages — lazy loaded, split ke chunk terpisah
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Article = lazy(() => import('./pages/Article'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Career = lazy(() => import('./pages/Career'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Shell & Auth — lazy loaded (TipTap bundle berat, jangan ikut public bundle)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const PrivateRoute = lazy(() => import('./components/admin/PrivateRoute'));

// Admin Pages — lazy loaded
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ArticleList = lazy(() => import('./pages/admin/articles/ArticleList'));
const ArticleEditor = lazy(() => import('./pages/admin/articles/ArticleEditor'));
const PortfolioList = lazy(() => import('./pages/admin/portfolio/PortfolioList'));
const PortfolioEditor = lazy(() => import('./pages/admin/portfolio/PortfolioEditor'));
const ApplicationList = lazy(() => import('./pages/admin/careers/ApplicationList'));
const ApplicationDetail = lazy(() => import('./pages/admin/careers/ApplicationDetail'));
const UserList = lazy(() => import('./pages/admin/users/UserList'));

// Fallback ringan saat lazy chunk dimuat
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--color-text-muted)',
      fontSize: '0.95rem',
    }}>
      Memuat...
    </div>
  );
}

// Public layout wrapper with Navbar & Footer
function PublicLayout() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/article" element={<Article />} />
              <Route path="/article/:slug" element={<ArticleDetail />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Login (Hidden URL, no hyperlink on public site) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />

              {/* Articles (Admin & Author) */}
              <Route path="articles" element={<ArticleList />} />
              <Route path="articles/new" element={<ArticleEditor />} />
              <Route path="articles/edit/:id" element={<ArticleEditor />} />

              {/* Portfolio (Admin) */}
              <Route path="portfolio" element={<PortfolioList />} />
              <Route path="portfolio/new" element={<PortfolioEditor />} />
              <Route path="portfolio/edit/:id" element={<PortfolioEditor />} />

              {/* Careers & Job Applications (Admin & HRD) */}
              <Route path="careers" element={<ApplicationList />} />
              <Route path="careers/:id" element={<ApplicationDetail />} />

              {/* User Management (Admin only) */}
              <Route path="users" element={<UserList />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
