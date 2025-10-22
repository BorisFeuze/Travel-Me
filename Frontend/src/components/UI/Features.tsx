import feature3 from "@/assets/images/feature3.jpg";

type Card = {
  title: string;
  desc: string;
  img: string;
  cta: { label: string; href: string };
};

const Features = () => {
  const cards: Card[] = [
    {
      title: "Find the right fit",
      desc: "Match the right skills with the right needs, using data-driven suggestions",
      img: feature3,
      cta: { label: "Find fit jobs", href: "/jobs" },
    },
    {
      title: "Through Working Instead of Pay",
      desc: "Find verified spaces, amenities, and day-pass options wherever you land.",
      img: feature3,
      cta: { label: "Find nice spaces", href: "/host" },
    },
    {
      title: "Reduce conflicts",
      desc: "Provide AI-powered personality compatibility insights and communication tips",
      img: feature3,
      cta: { label: "Learn culture", href: "/localtips" },
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#0F1525]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-6xl font-black inline-block rounded-2xl px-4 py-4 text-[#C6F36B] mt-4">
            Why Travel Me?
          </h2>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {cards.map((c, i) => (
            <article
              key={c.title + i}
              className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl"
            >
              <figure className="overflow-hidden rounded-t-2xl">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
              </figure>

              <div className="card-body">
                <h3 className="card-title text-xl font-bold">{c.title}</h3>
                <p className="text-base-content/80">{c.desc}</p>
                <div className="card-actions mt-4">
                  <a href={c.cta.href} className="btn btn-primary">
                    {c.cta.label}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
