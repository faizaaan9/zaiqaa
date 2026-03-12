export default function ZaiqaaLogo({ size = "md", dark = false }) {
  const s = { sm:"w-8 h-8", md:"w-10 h-10", lg:"w-14 h-14" };
  const t = { sm:"text-lg", md:"text-xl", lg:"text-3xl" };
  return (
    <div className="flex items-center gap-2.5">
      <div className={`${s[size]} bg-gradient-to-br from-z-600 to-z-900 rounded-2xl flex items-center justify-center shadow-md`}>
        <span className="text-xl">🫕</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold ${t[size]} ${dark ? "text-z-900" : "text-z-800"}`}>Zaiqaa</span>
        <span className="text-gold-600 text-[9px] font-bold tracking-widest uppercase">Taste the Authentic</span>
      </div>
    </div>
  );
}
