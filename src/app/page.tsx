'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AuthForm from '@/components/auth/AuthForm';
import FactionSelection from '@/components/onboarding/FactionSelection';
import CharacterSelection from '@/components/onboarding/CharacterSelection'; // 1. On importe le nouveau composant
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [faction, setFaction] = useState<string | null>(null);
  // 2. Nouvelle variable d'état pour retenir le sexe du personnage
  const [gender, setGender] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.username);
      setFaction(data.faction || null);
      // 3. On récupère le sexe s'il existe dans Firestore
      setGender(data.gender || null);
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
        setGender(null); // On réinitialise aussi le genre à la déconnexion
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
        ) : !gender ? (
          /* 4. Le joueur a une faction mais pas de personnage : On affiche le choix du perso */
          <CharacterSelection
            uid={user.uid}
            onComplete={() => fetchUserData(user.uid)}
          />
        ) : (
          /* Le joueur a tout complété : On affiche le Fief */
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
