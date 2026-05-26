'use client';

import { useState } from 'react';
import { auth, db, googleProvider } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { validateUsername, checkPasswordStrength } from '@/utils/validation';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const pwdStrength = !isLogin
    ? checkPasswordStrength(password)
    : { score: 0, label: 'Vide', color: 'bg-gray-600', isValid: false };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        let loginEmail = email;

        if (!email.includes('@')) {
          const q = query(
            collection(db, 'users'),
            where('usernameLower', '==', email.toLowerCase())
          );
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            throw new Error('Aucun chevalier ne possède ce pseudo.');
          }
          loginEmail = querySnapshot.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, loginEmail, password);
      } else {
        const usernameCheck = validateUsername(username);
        if (!usernameCheck.isValid) throw new Error(usernameCheck.error);
        if (!pwdStrength.isValid) throw new Error(pwdStrength.label);

        const q = query(
          collection(db, 'users'),
          where('usernameLower', '==', username.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty)
          throw new Error('Ce pseudo est déjà utilisé par un autre seigneur.');

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: username,
          usernameLower: username.toLowerCase(),
          email: email,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        // Traduction des erreurs Firebase pour l'utilisateur
        if (
          msg.includes('invalid-credential') ||
          msg.includes('wrong-password') ||
          msg.includes('user-not-found')
        ) {
          setError(
            'Identifiants incorrects. Vérifiez votre email/pseudo et votre mot de passe.'
          );
        } else if (msg.includes('email-already-in-use')) {
          setError('Cette adresse email est déjà associée à un blason.');
        } else if (msg.includes('too-many-requests')) {
          setError(
            'Trop de tentatives échouées. Le compte est temporairement bloqué, veuillez patienter.'
          );
        } else {
          setError(msg);
        }
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSign = async () => {
    setError('');
    setSuccessMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        const randomData = Math.floor(1000 + Math.random() * 9000);
        const defaultName = `Chevalier${randomData}`;
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: defaultName,
          usernameLower: defaultName.toLowerCase(),
          email: user.email || '',
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('popup-closed-by-user')) {
          setError('La connexion Google a été annulée.');
        } else {
          setError('Erreur lors de la connexion avec Google.');
        }
      }
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccessMessage('');
    if (!email || !email.includes('@')) {
      setError(
        'Veuillez renseigner une adresse email valide dans le champ ci-dessus pour recevoir le lien de réinitialisation.'
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage(
        'Un email de réinitialisation de mot de passe a été envoyé à votre adresse !'
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          "Impossible d'envoyer l'email. Vérifiez l'adresse ou essayez de créer un compte."
        );
      }
    }
  };

  return (
    <div className='w-full max-w-md bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-xl'>
      <h2 className='text-2xl font-bold text-center text-yellow-500 mb-6'>
        {isLogin ? 'Accéder au Fief' : "Rejoindre l'Ordre"}
      </h2>

      {error && (
        <div className='bg-red-900/50 border border-red-500 text-red-200 text-sm p-3 rounded mb-4 text-center'>
          {error}
        </div>
      )}
      {successMessage && (
        <div className='bg-green-900/50 border border-green-500 text-green-200 text-sm p-3 rounded mb-4 text-center'>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div>
          <label className='text-xs font-semibold uppercase text-gray-400 block mb-1'>
            {isLogin ? 'Email ou Pseudo' : 'Adresse Email'}
          </label>
          <input
            type='text'
            required
            className='w-full bg-slate-900 border border-slate-700 p-2 rounded text-white focus:outline-none focus:border-yellow-500'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div>
            <label className='text-xs font-semibold uppercase text-gray-400 block mb-1'>
              {'Pseudo de Chevalier (Lettres uniquement, max 12)'}
            </label>
            <input
              type='text'
              required
              className='w-full bg-slate-900 border border-slate-700 p-2 rounded text-white focus:outline-none focus:border-yellow-500'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div>
          <label className='text-xs font-semibold uppercase text-gray-400 block mb-1'>
            {'Mot de passe'}
          </label>
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className='w-full bg-slate-900 border border-slate-700 p-2 pr-10 rounded text-white focus:outline-none focus:border-yellow-500'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type='button'
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer'
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                  />
                </svg>
              ) : (
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                </svg>
              )}
            </button>
          </div>

          {isLogin && (
            <div className='text-right mt-1'>
              <button
                type='button'
                onClick={handleForgotPassword}
                className='text-xs text-gray-400 hover:text-yellow-500 hover:underline cursor-pointer'>
                {'Mot de passe oublié ?'}
              </button>
            </div>
          )}

          {!isLogin && password && (
            <div className='mt-2'>
              <div className='flex justify-between text-xs mb-1 text-gray-400'>
                <span>{'Sécurité :'}</span>
                <span className='font-bold'>{pwdStrength.label}</span>
              </div>
              <div className='w-full bg-slate-900 h-2 rounded-full overflow-hidden'>
                <div
                  className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                  style={{ width: `${(pwdStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-yellow-600 hover:bg-yellow-500 text-slate-950 font-bold p-2.5 rounded transition mt-2 disabled:opacity-50 cursor-pointer'>
          {loading
            ? 'Chargement...'
            : isLogin
            ? 'Se connecter'
            : 'Créer mon compte'}
        </button>
      </form>

      <div className='relative flex py-4 items-center'>
        <div className='flex-grow border-t border-slate-700'></div>
        <span className='flex-shrink mx-4 text-gray-500 text-xs uppercase'>
          {'Ou'}
        </span>
        <div className='flex-grow border-t border-slate-700'></div>
      </div>

      <button
        onClick={handleGoogleSign}
        type='button'
        className='w-full bg-slate-900 hover:bg-slate-950 text-white border border-slate-700 p-2 rounded flex items-center justify-center gap-2 transition cursor-pointer'>
        <svg className='w-4 h-4' viewBox='0 0 24 24'>
          <path
            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            fill='#4285F4'
          />
          <path
            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            fill='#34A853'
          />
          <path
            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z'
            fill='#FBBC05'
          />
          <path
            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z'
            fill='#EA4335'
          />
        </svg>
        {"S'identifier avec Google"}
      </button>

      <p className='text-sm text-center text-gray-400 mt-6'>
        {isLogin ? 'Nouveau sur les terres ?' : "Déjà membre de l'Ordre ?"}{' '}
        <button
          type='button'
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setSuccessMessage('');
            setEmail('');
            setUsername('');
            setPassword('');
            setShowPassword(false);
          }}
          className='text-yellow-500 hover:underline font-semibold cursor-pointer'>
          {isLogin ? 'Créer un blason' : 'Se connecter'}
        </button>
      </p>
    </div>
  );
}
