export default function Home() {
  return (
    <main className='min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6'>
      {/* Zone du haut (vide pour l'instant pour centrer le contenu) */}
      <div />

      {/* Zone du milieu : Titre et message */}
      <div className='text-center flex flex-col items-center justify-center'>
        <h1 className='text-5xl font-bold text-yellow-500 mb-6 tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]'>
          KNIGHTS OF LIXXA
        </h1>
        <p className='text-xl text-gray-300 italic max-w-md'>
          {`"Bienvenue, Seigneur. Votre fief attend vos ordres."`}
        </p>
      </div>

      {/* Zone du bas : Pied de page avec la version du jeu */}
      <footer className='text-sm text-gray-500 font-mono tracking-wider border-t border-slate-800 pt-4 w-full text-center'>
        Alpha Version v0.1.0 • Knights of Lixxa
      </footer>
    </main>
  );
}
