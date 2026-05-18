import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerRestaurant, clearError } from '../redux/authSlice';
import toast from 'react-hot-toast';
import {
  Mail, Lock, Eye, EyeOff, User, Phone, MapPin,
  ChefHat, Loader2, Camera, ImagePlus,
} from 'lucide-react';
import '../styles/Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const fileRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

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

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, phone, address } = form;
    if (!name || !email || !password || !phone || !address) {
      return toast.error('Please fill in all fields');
    }
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);

    const result = await dispatch(registerRestaurant(fd));
    if (registerRestaurant.fulfilled.match(result)) {
      toast.success('Restaurant registered successfully! 🎉');
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
          <h1 className="auth-headline">Join Millions of Restaurant Partners</h1>
          <p className="auth-subline">
            Start receiving online orders in minutes. Set up your menu, manage inventory, and grow revenue with Zomato.
          </p>
          <ul className="auth-benefits">
            <li>✅ Zero commission for first 30 days</li>
            <li>✅ Real-time order tracking</li>
            <li>✅ Dedicated partner support</li>
            <li>✅ Instant payout settlements</li>
          </ul>
        </div>
        <div className="auth-blob blob-1" />
        <div className="auth-blob blob-2" />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-card register-card">
          <div className="auth-card-header">
            <div className="zomato-pill">🍽️ Partner Registration</div>
            <h2>Create your restaurant account</h2>
            <p>Get your restaurant live on Zomato within minutes</p>
          </div>

          {/* Image Upload */}
          <div className="avatar-upload" onClick={() => fileRef.current.click()}>
            {preview ? (
              <img src={preview} alt="Restaurant" className="avatar-preview" />
            ) : (
              <div className="avatar-placeholder">
                <ImagePlus size={32} />
                <span>Upload Restaurant Photo</span>
              </div>
            )}
            <div className="avatar-overlay"><Camera size={20} /></div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} hidden />
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Restaurant Name</label>
                <div className="input-wrapper">
                  <User size={18} className="input-icon" />
                  <input id="name" type="text" name="name" placeholder="Spice Garden" value={form.name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input id="phone" type="tel" name="phone" placeholder="9876543210" value={form.phone} onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input id="reg-email" type="email" name="email" placeholder="restaurant@example.com" value={form.email} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="reg-password" type={showPass ? 'text' : 'password'} name="password"
                  placeholder="Minimum 6 characters" value={form.password} onChange={handleChange}
                />
                <button type="button" className="eye-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Restaurant Address</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <input id="address" type="text" name="address" placeholder="12 MG Road, Surat" value={form.address} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={18} className="spin" /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer-text">
            Already a partner?{' '}
            <Link to="/login" className="auth-link">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
