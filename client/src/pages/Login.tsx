import { useState } from 'react';
import { Link } from 'react-router';
import { Button, TextField, Typography, Alert, Card, CardContent } from '@mui/material';

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
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <Card>
        <CardContent className="p-6">
          <Typography variant="h4" className="text-center mb-6">
            Connexion
          </Typography>
          
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="mt-4"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/register" className="text-blue-600 hover:underline">
                Pas de compte ? S'inscrire
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}