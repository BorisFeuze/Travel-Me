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
      title: "Virable Jobs",
      desc: "Curated roles with visa/relocation flags and async-friendly teams.",
      img: feature3,
      cta: { label: "Browse jobs", href: "/jobs" },
    },
    {
      title: "Through Working Instead Pay",
      desc: "Find verified spaces, amenities, and day-pass options wherever you land.",
      img: feature3,
      cta: { label: "Find spaces", href: "/coworking" },
    },
    {
      title: "Visa & Rules",
      desc: "Up-to-date entry requirements and documents for stress-free trips.",
      img: feature3,
      cta: { label: "Check rules", href: "/visa" },
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-[#0F1525]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-6xl font-black inline-block rounded-2xl px-4 py-4 text-[#C6F36B] mt-4">
            Why Travel Me?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {cards.map((c, i) => (
            <article
              key={c.title + i}
              className="card w-96 bg-base-100 border border-base-300/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl"
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
