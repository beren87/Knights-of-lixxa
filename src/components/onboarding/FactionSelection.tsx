'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { factions } from '@/data/factions';

const Icons = {
  harvest: (
    <svg
      className='w-5 h-5 text-gray-400'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'
      />
    </svg>
  ),
  activity: (
    <svg
      className='w-5 h-5 text-gray-400'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    </svg>
  ),
  combat: (
    <svg
      className='w-5 h-5 text-gray-400'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      viewBox='0 0 24 24'>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M17 10.5V7a2 2 0 00-2-2H9a2 2 0 00-2 2v3.5M3 13.5v-3a2 2 0 012-2h14a2 2 0 012 2v3M7 16.5l-3 4.5h16l-3-4.5'
      />
    </svg>
  ),
};

const colorClasses: Record<string, string> = {
  cyan: 'border-cyan-500 text-cyan-500 shadow-cyan-900/50',
  emerald: 'border-emerald-500 text-emerald-500 shadow-emerald-900/50',
  stone: 'border-stone-500 text-stone-500 shadow-stone-900/50',
  purple: 'border-purple-500 text-purple-500 shadow-purple-900/50',
  yellow: 'border-yellow-500 text-yellow-500 shadow-yellow-900/50',
  red: 'border-red-500 text-red-500 shadow-red-900/50',
};

export default function FactionSelection({
  uid,
  onComplete,
}: {
  uid: string;
  onComplete: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const faction = factions[currentIndex];
  const colorData = colorClasses[faction.color];

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % factions.length);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? factions.length - 1 : prev - 1));

  const getCardStyles = (index: number): React.CSSProperties => {
    const total = factions.length;
    let diff = index - currentIndex;
    if (diff > Math.floor(total / 2)) diff -= total;
    if (diff < -Math.floor(total / 2)) diff += total;

    const distance = Math.abs(diff);

    let translateX = diff < 0 ? -150 : 150;
    let scale = 0.6;
    let opacity = 0;
    let zIndex = 0;

    if (distance === 0) {
      translateX = 0;
      scale = 1;
      opacity = 1;
      zIndex = 20;
    } else if (distance === 1) {
      translateX = diff < 0 ? -85 : 85;
      scale = 0.85;
      opacity = 0.4;
      zIndex = 10;
    }

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      zIndex,
      opacity,
    };
  };

  const handleCardClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        faction: faction.id,
      });
      onComplete();
    } catch (error) {
      console.error("Erreur lors de l'allégeance", error);
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4'>
      <div className='text-center mb-4 shrink-0'>
        <h2 className='text-2xl md:text-3xl font-bold text-white mb-1 tracking-widest'>
          ALLÉGEANCE
        </h2>
        <p className='text-gray-400 text-xs md:text-sm'>
          Choisissez la bannière sous laquelle votre Fief prospérera.
        </p>
      </div>

      {/* Zone du Carrousel avec une hauteur stricte bloquée pour éviter le scroll de la page */}
      <div className='relative w-full h-[460px] flex items-center justify-center'>
        {factions.map((f, index) => {
          const style = getCardStyles(index);
          const fColorData = colorClasses[f.color];
          const isCenter = index === currentIndex;

          return (
            <div
              key={f.id}
              onClick={() => handleCardClick(index)}
              // La carte est maintenant un conteneur flex avec une hauteur fixe stricte
              className={`absolute flex flex-col h-[460px] transition-all duration-500 ease-out w-[90%] max-w-[340px] bg-slate-900 border-2 ${
                fColorData.split(' ')[0]
              } rounded-xl p-4 shadow-2xl ${
                !isCenter ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              style={style}>
              {/* Titre épinglé en haut */}
              <h3
                className={`text-2xl font-extrabold text-center uppercase mb-3 shrink-0 ${
                  fColorData.split(' ')[1]
                }`}>
                {f.name}
              </h3>

              {/* Zone centrale avec scroll interne discret si le contenu dépasse */}
              <div className='flex-1 overflow-y-auto pr-2 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-800/50 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full'>
                <div className='w-full h-24 shrink-0 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden relative'>
                  <span className='text-slate-600 text-xs italic'>
                    Emplacement Image
                  </span>
                </div>

                <p className='text-gray-300 text-xs italic text-center'>
                  {`"${f.description}"`}
                </p>

                <div className='space-y-2 pb-2'>
                  {f.bonuses.map((bonus, i) => (
                    <div
                      key={i}
                      className='flex items-start gap-2 bg-slate-800/50 p-2 rounded-lg'>
                      <div className='mt-0.5'>{Icons[bonus.iconType]}</div>
                      <div>
                        <h4 className='font-bold text-gray-200 text-xs'>
                          {bonus.title}
                        </h4>
                        <p className='text-[10px] text-gray-400 leading-tight mt-0.5'>
                          {bonus.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton épinglé en bas */}
              <div className='pt-3 mt-auto shrink-0 border-t border-slate-800/50'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isCenter) setShowModal(true);
                  }}
                  disabled={!isCenter}
                  className={`w-full py-2.5 text-sm font-bold text-white uppercase tracking-wider rounded-lg border-2 ${
                    fColorData.split(' ')[0]
                  } bg-slate-800 hover:bg-slate-700 transition ${
                    isCenter ? 'cursor-pointer' : 'cursor-default opacity-0'
                  }`}>
                  Faire Allégeance
                </button>
              </div>
            </div>
          );
        })}

        {/* Boutons de navigation (Ajustement du positionnement vertical) */}
        <button
          onClick={handlePrev}
          className='absolute left-0 md:left-10 z-30 p-2 md:p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition cursor-pointer text-white border border-slate-600 shadow-xl'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className='absolute right-0 md:right-10 z-30 p-2 md:p-3 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition cursor-pointer text-white border border-slate-600 shadow-xl'>
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 5l7 7-7 7'
            />
          </svg>
        </button>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4'>
          <div className='bg-slate-900 border border-slate-700 p-6 rounded-lg w-full max-w-sm text-center shadow-2xl'>
            <h3 className='text-xl font-bold text-white mb-4'>
              Prêter Serment
            </h3>
            <p className='text-gray-400 text-sm mb-6'>
              Êtes-vous certain de vouloir prêter allégeance à{' '}
              <strong className={colorData.split(' ')[1]}>
                {faction.name}
              </strong>{' '}
              ?<br />
              <br />
              <span className='text-yellow-500/80 text-xs'>
                Note : Ce choix scellera votre destin. Vous devrez atteindre le
                niveau 15 pour pouvoir changer de bannière.
              </span>
            </p>
            <div className='flex gap-4'>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className='flex-1 py-2 text-sm bg-slate-800 text-gray-300 rounded hover:bg-slate-700 transition cursor-pointer disabled:opacity-50'>
                Annuler
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 py-2 text-sm font-bold text-white rounded bg-slate-800 border ${
                  colorData.split(' ')[0]
                } hover:bg-slate-700 transition cursor-pointer disabled:opacity-50`}>
                {loading ? 'Sceau en cours...' : 'Valider'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
