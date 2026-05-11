export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* top-right warm glow */}
      <div className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-amber-200/25 dark:bg-violet-800/35 blur-3xl animate-aurora-1" />

      {/* bottom-left cool glow */}
      <div className="absolute -bottom-[15%] -left-[15%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full bg-sky-200/25 dark:bg-cyan-900/35 blur-3xl animate-aurora-2" />

      {/* center-right accent */}
      <div className="absolute top-[40%] -right-[8%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full bg-purple-200/15 dark:bg-indigo-900/30 blur-3xl animate-aurora-3" />
    </div>
  );
}
