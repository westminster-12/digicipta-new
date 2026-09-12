import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Article from './pages/Article';
import ArticleDetail from './pages/ArticleDetail';
import Career from './pages/Career';
import Contact from './pages/Contact';

// Admin Shell & Auth
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import PrivateRoute from './components/admin/PrivateRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ArticleList from './pages/admin/articles/ArticleList';
import ArticleEditor from './pages/admin/articles/ArticleEditor';
import PortfolioList from './pages/admin/portfolio/PortfolioList';
import PortfolioEditor from './pages/admin/portfolio/PortfolioEditor';
import ApplicationList from './pages/admin/careers/ApplicationList';
import ApplicationDetail from './pages/admin/careers/ApplicationDetail';
import UserList from './pages/admin/users/UserList';

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
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}

export default App;
