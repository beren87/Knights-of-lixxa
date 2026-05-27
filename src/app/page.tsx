'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthForm from '@/components/auth/AuthForm';
import FactionSelection from '@/components/onboarding/FactionSelection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  // Nouvelle variable d'état pour retenir la faction
  const [faction, setFaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On isole la récupération des données pour pouvoir la rappeler facilement
  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.username);
      // On récupère la faction si elle existe, sinon ça reste null
      setFaction(data.faction || null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUsername('');
        setFaction(null);
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
        ) : !faction ? (
          /* Le joueur est connecté mais n'a pas de faction : On affiche le carrousel */
          <FactionSelection
            uid={user.uid}
            onComplete={() => fetchUserData(user.uid)}
          />
        ) : (
          /* Le joueur est connecté ET a une faction : On affiche le Fief */
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
              className='bg-red-700 hover:bg-red-600 text-white text-sm font-semibold py-2 px-4 rounded transition cursor-pointer'>
              Quitter le fief (Déconnexion)
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
