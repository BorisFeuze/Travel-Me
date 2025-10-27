type Card = {
  title: string;
  desc: string;
  cta: { label: string; href: string };
};

const Features = () => {
  const cards: Card[] = [
    {
      title: "Optimal opportunities",
      desc: "Discover tailored, high-quality opportunities that match your skills, availability and travel goals.",
      cta: { label: "Explore opportunities", href: "/opportunities" },
    },
    {
      title: "Use skills instead of paying",
      desc: "Exchange your abilities for accommodation, meals, or local experiences — no cash required.",
      cta: { label: "Offer your skills", href: "/host" },
    },
    {
      title: "Skill matching for hosts & travelers",
      desc: "Smart matching connects hosts' needs with travelers' skills to create win-win stays and better experiences.",
      cta: { label: "Start matching", href: "/signup" },
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#0F1525] text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-black inline-block rounded-2xl px-4 py-4 text-[#C6F36B] mt-4">
            Why Travel Me?
          </h2>
        </div>

        {/* Responsive 3-column grid, image-free feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <article
              key={c.title + i}
              className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow min-h-[220px]"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#C6F36B] text-black font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm md:text-base text-white/85">
                    {c.desc}
                  </p>
                </div>
              </div>

              {/* CTA buttons removed — informational cards only */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
