import { useState } from 'react';
import { Link } from 'react-router';
import axios from '../config/axiosConfig';
import { Login as LoginIcon } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/login', { email, password });
      window.location.href = '/';
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/auth/login', {
        email: 'invite@mellisync.demo',
        password: 'demo2025'
      });
      window.location.href = '/';
    } catch (error: any) {
      setError(error.response?.data?.error || 'Erreur de connexion invité');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-4">
        {/* Accès démo pour recruteurs - design sobre */}
        <div className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-5">
          <p className="text-center text-gray-700 mb-3">
            Recruteur ? Testez en 1 clic
          </p>
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Connexion...' : 'Accéder à la démo'}
          </button>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <LoginIcon className="text-blue-600" fontSize="large" />
            <h2 className="text-2xl font-semibold text-gray-800">Connexion</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-colors ${
                loading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-gray-200 border-t-transparent rounded-full"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <LoginIcon fontSize="small" />
                  Se connecter
                </>
              )}
            </button>
          </form>
          
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Pas de compte ? S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}