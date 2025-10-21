const Joinus = () => {
  return (
    <section className="mx-auto max-w-6xl overflow-hidden px-4  py-12 margin-y-20">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border bg-#8FDC00B3 p-6 shadow-sm">
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
        <div className="rounded-3xl border p-6 shadow-sm">
          <div className="mb-2 text-lg font-semibold">Already a member?</div>
          <p className="text-sm text-slate-600">
            Sign in to your account to access exclusive features.
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href="/login"
              className="rounded-xl border bg-black px-4 py-2 text-white"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Joinus;
