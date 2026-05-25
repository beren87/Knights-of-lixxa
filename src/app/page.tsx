import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className='min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6'>
      <div /> {/* Espace du haut */}
      {/* Le contenu central */}
      <div className='text-center flex flex-col items-center justify-center'>
        <h1 className='text-5xl font-bold text-yellow-500 mb-6 tracking-widest drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]'>
          KNIGHTS OF LIXXA
        </h1>
        <p className='text-xl text-gray-300 italic max-w-md'>
          {`"Bienvenue, Seigneur. Votre fief attend vos ordres."`}
        </p>
      </div>
      {/* Notre nouvelle brique importée ! */}
      <Footer />
    </main>
  );
}
