'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthForm from '@/components/auth/AuthForm';
// Si l'erreur persiste sur cette ligne, remplace le "@" par ".."
import Footer from '@/components/layout/Footer';

export default function Home() {
  // On remplace 'any' par 'User' (le type officiel de Firebase)
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username);
        }
      } else {
        setUsername('');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <main className='min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6'>
      <div />

      <div className='w-full flex flex-col items-center justify-center gap-8'>
        <div className='text-center'>
          <h1 className='text-5xl font-bold text-yellow-500 mb-3 tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]'>
            KNIGHTS OF LIXXA
          </h1>
          {/* Correction des guillemets avec les accolades et backticks */}
          <p className='text-md text-gray-400 italic'>
            {`"Votre royaume à portée de clic"`}
          </p>
        </div>

        {loading ? (
          <div className='text-yellow-500 animate-pulse font-mono'>
            Chargement de la garnison...
          </div>
        ) : !user ? (
          <AuthForm />
        ) : (
          <div className='text-center bg-slate-800 border border-slate-700 p-6 rounded-lg max-w-md w-full shadow-xl'>
            <p className='text-xl text-gray-200 mb-2'>
              Salutations, Messire{' '}
              <span className='text-yellow-500 font-bold'>
                {username || '...'}
              </span>{' '}
              !
            </p>
            <p className='text-sm text-gray-400 mb-6'>
              Votre fief est en sécurité. Les fondations du village sont prêtes
              pour les prochaines constructions.
            </p>
            <button
              onClick={handleLogout}
              className='bg-red-700 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded transition'>
              Quitter le fief (Déconnexion)
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
