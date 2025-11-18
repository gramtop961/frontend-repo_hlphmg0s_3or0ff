import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <div className="relative w-full h-[280px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
      <Spline scene="https://prod.spline.design/UGnf9D1Hp3OG8vSG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(147,197,253,0.12),transparent)]" />
      <div className="absolute bottom-4 left-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow">Gather and Rule</h1>
        <p className="text-sky-300/90 text-sm md:text-base">A modern digital board game on a 2.5D grid</p>
      </div>
    </div>
  )
}

export default Hero
