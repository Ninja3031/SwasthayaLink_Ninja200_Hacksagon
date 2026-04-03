import { useState, useEffect } from "react";
import { UserPlus, UserCircle, Building2, Stethoscope, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";

export default function Auth() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", contactNumber: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigate(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setError("");
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "/api/v1/auth/login" : "/api/v1/auth/register";
    try {
      const res = await axios.post(endpoint, { ...formData, role: selectedRole });
      login(res.data.data.user);
      navigate(`/${selectedRole}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication Failed. Try again.");
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to SwasthyaLink</h1>
            <p className="text-lg text-gray-600">Select your portal to continue</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onClick={() => handleRoleSelection("patient")} className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-500 transition-all text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Patient Portal</h3>
              <p className="text-gray-500 text-sm">Book appointments, view records, and claim insurance.</p>
            </button>

            <button onClick={() => handleRoleSelection("doctor")} className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:green-blue-500 transition-all text-center hover:border-green-500">
              <div className="mx-auto w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Doctor Portal</h3>
              <p className="text-gray-500 text-sm">Manage patients, schedule availability, and prescribe.</p>
            </button>

            <button onClick={() => handleRoleSelection("hospital")} className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:purple-blue-500 transition-all text-center hover:border-purple-500">
              <div className="mx-auto w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hospital Admin</h3>
              <p className="text-gray-500 text-sm">Manage staff, beds availability, and hospital workflows.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 bg-blue-600 text-white flex items-center">
          <button onClick={() => setSelectedRole(null)} className="mr-4 hover:bg-blue-700 p-2 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold flex items-center capitalize">{selectedRole} Login</h2>
        </div>
        
        <form onSubmit={handleAuth} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
          
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" onChange={e => setFormData({...formData, name: e.target.value})}/>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input required type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="you@domain.com" onChange={e => setFormData({...formData, email: e.target.value})}/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input required type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})}/>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>

          <p className="text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
              {isLogin ? "Create one" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
