export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/60 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
        <p className="max-w-xl text-sm leading-relaxed text-slate-500">
          BillScope is a hackathon project. It analyzes sample bills or your own, never stores
          PHI, and does not constitute legal or financial advice.
        </p>
      </div>
    </footer>
  );
}
