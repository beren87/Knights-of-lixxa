'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function CharacterSelection({
  uid,
  onComplete,
}: {
  uid: string;
  onComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSelect = async (gender: 'male' | 'female') => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        gender: gender,
        // On peut aussi marquer l'onboarding comme terminé ici
        onboardingCompleted: true,
      });
      onComplete();
    } catch (error) {
      console.error('Erreur lors du choix du personnage', error);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4'>
      <div className='text-center mb-6 shrink-0'>
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-1 tracking-widest uppercase'>
          Votre Identité
        </h2>
        <p className='text-gray-400 text-xs md:text-sm'>
          Qui prendra la tête du Fief ?
        </p>
      </div>

      {/* Conteneur principal avec hauteur fixe pour éviter le scroll */}
      <div className='flex flex-col md:flex-row gap-6 w-full h-[400px] items-center justify-center'>
        {/* Carte Homme */}
        <div className='relative flex flex-col h-full w-full max-w-[280px] bg-slate-900 border-2 border-slate-700 rounded-xl p-4 shadow-xl hover:border-amber-500 hover:shadow-amber-900/20 transition-all duration-300'>
          <h3 className='text-xl font-extrabold text-center uppercase mb-4 text-slate-300 shrink-0'>
            Chevalier
          </h3>

          <div className='flex-1 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center mb-4 overflow-hidden relative'>
            <span className='text-slate-600 text-xs italic'>
              Portrait Homme
            </span>
          </div>

          <div className='pt-2 mt-auto shrink-0 border-t border-slate-800'>
            <button
              onClick={() => handleSelect('male')}
              disabled={loading}
              className='w-full py-2.5 text-sm font-bold text-white uppercase tracking-wider rounded-lg border-2 border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-amber-500 hover:text-amber-500 transition cursor-pointer disabled:opacity-50'>
              {loading ? 'Chargement...' : 'Sélectionner'}
            </button>
          </div>
        </div>

        {/* Carte Femme */}
        <div className='relative flex flex-col h-full w-full max-w-[280px] bg-slate-900 border-2 border-slate-700 rounded-xl p-4 shadow-xl hover:border-amber-500 hover:shadow-amber-900/20 transition-all duration-300'>
          <h3 className='text-xl font-extrabold text-center uppercase mb-4 text-slate-300 shrink-0'>
            Chevalière
          </h3>

          <div className='flex-1 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center mb-4 overflow-hidden relative'>
            <span className='text-slate-600 text-xs italic'>
              Portrait Femme
            </span>
          </div>

          <div className='pt-2 mt-auto shrink-0 border-t border-slate-800'>
            <button
              onClick={() => handleSelect('female')}
              disabled={loading}
              className='w-full py-2.5 text-sm font-bold text-white uppercase tracking-wider rounded-lg border-2 border-slate-600 bg-slate-800 hover:bg-slate-700 hover:border-amber-500 hover:text-amber-500 transition cursor-pointer disabled:opacity-50'>
              {loading ? 'Chargement...' : 'Sélectionner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
