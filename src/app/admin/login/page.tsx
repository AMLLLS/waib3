"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiLockLine, RiUserLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-lighter rounded-2xl p-8 shadow-xl border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Administration</h1>
            <p className="text-gray-400">Connectez-vous pour gérer votre contenu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                  Email
                </label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-dark border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez votre email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 bg-dark border border-white/5 rounded-xl focus:outline-none focus:ring-2 ring-primary/50"
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-primary text-dark font-medium rounded-xl flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dark/20 border-t-dark rounded-full animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 