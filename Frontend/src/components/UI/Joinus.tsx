const Joinus = () => {
  return (
    <section className="grid grid-cols-1 py-12 lg:py-16 bg-[#0F1525] justify-items-center">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-[2fr,1fr]">
        <div className="h-64 rounded-2xl border bg-[#8FDC00B3] p-6 shadow-sm">
          <div className="mb-2 text-lg font-semibold">Want to join us?</div>
          <p className="text-sm text-slate-600">
            Create a profile as a volunteer or host and start connecting today.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="/register"
              className="rounded-xl border bg-black px-4 py-2 text-white"
            >
              Get started
            </a>
          </div>
        </div>
        <div className="rounded-3xl border p-6 shadow-sm text-white">
          <div className="mb-2 text-lg font-semibold">
            a better local experience and reminder culture conflicts?
          </div>
          <p className="text-sm text-slate-600">
            Sign in to your account to access exclusive features.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="/login"
              className="rounded-xl border bg-black px-4 py-2 text-white"
            >
              quick learn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Joinus;
