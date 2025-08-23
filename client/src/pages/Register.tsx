import { useState } from 'react';
import { Link } from 'react-router';
import { Button, TextField, Typography, Alert, Card, CardContent } from '@mui/material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur d\'inscription');
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
            Inscription
          </Typography>
          
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          
          <form onSubmit={handleRegister} className="space-y-4">
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
            
            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="mt-4"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-blue-600 hover:underline">
                Déjà un compte ? Se connecter
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}