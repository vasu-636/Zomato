import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginRestaurant, clearError } from '../redux/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ChefHat, Loader2 } from 'lucide-react';
import '../styles/Auth.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  // If already logged in, go to dashboard
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    const result = await dispatch(loginRestaurant(form));
    if (loginRestaurant.fulfilled.match(result)) {
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="brand-logo">
            <ChefHat size={40} />
            <span>Zomato</span>
          </div>
          <h1 className="auth-headline">Power Your Restaurant with Zomato</h1>
          <p className="auth-subline">
            Manage your menu, track live orders, and grow your business — all from one dashboard.
          </p>
          <div className="auth-stats">
            <div className="stat-item"><span className="stat-num">5L+</span><span className="stat-label">Restaurants</span></div>
            <div className="stat-divider" />
            <div className="stat-item"><span className="stat-num">2Cr+</span><span className="stat-label">Orders/Day</span></div>
            <div className="stat-divider" />
            <div className="stat-item"><span className="stat-num">99.9%</span><span className="stat-label">Uptime</span></div>
          </div>
        </div>
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
      </div>

      {/* Right Panel — Form */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="zomato-pill">🍽️ Partner Login</div>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your restaurant dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="restaurant@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer-text">
            New restaurant partner?{' '}
            <Link to="/register" className="auth-link">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
