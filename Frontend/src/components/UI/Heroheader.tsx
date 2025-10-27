import React from "react";

type Media = { type: "image"; src: string; alt?: string } | { type: "none" };

export type HeroheaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href?: string; onClick?: () => void };
  secondaryCta?: { label: string; href?: string; onClick?: () => void };
  align?: "left" | "center";
  bgImageUrl?: string; // optional background image
  overlayOpacity?: number; // 0..1 (default 0.4)
  media?: Media; // optional inline image on the right (simple)
  className?: string;
};

const Heroheader: React.FC<HeroheaderProps> = ({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  align = "center",
  bgImageUrl = "",
  overlayOpacity = 0.4,
  media = { type: "none" },
  className = "",
}) => {
  const isCenter = align === "center";
  const contentAlignment = isCenter
    ? "text-center items-center"
    : "text-left items-start";
  const textContainerWidth = media.type === "image" ? "md:w-1/1" : "w-full";

  return (
    <section
      className={`hero min-h-[80vh] bg-cover bg-center ${className}`}
      style={{
        backgroundImage: `url(${bgImageUrl})`,
      }}
      aria-label="Hero section"
    >
      {/* Overlay with adjustable opacity */}
      <div
        className="hero-overlay"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      ></div>

      <div className={`hero-content ${contentAlignment} w-full px-6`}>
        <div
          className={`max-w-7xl w-full flex flex-col md:flex-row items-center gap-8`}
        >
          {/* Text block */}
          <div
            className={`flex flex-col justify-center ${textContainerWidth} ${
              isCenter ? "mx-auto" : ""
            }`}
          >
            {eyebrow && (
              <p className="text-2xl uppercase tracking-wider font-black text-accent opacity-90 mb-2">
                {eyebrow}
              </p>
            )}

            <h1 className="mb-10 text-4xl md:text-[4rem] font-extrabold leading-tight text-[#C6F36B] hero-header-title">
              {title}
            </h1>

            {subtitle && (
              <p className="mb-6 text-base md:text-lg text-neutral-content/90">
                {subtitle}
              </p>
            )}

            <div
              className={`flex ${
                isCenter ? "justify-center" : "justify-start"
              } gap-3`}
            >
              {primaryCta &&
                (primaryCta.href ? (
                  <a
                    href={primaryCta.href}
                    className="btn btn-primary"
                    onClick={primaryCta.onClick}
                  >
                    {primaryCta.label}
                  </a>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={primaryCta.onClick}
                  >
                    {primaryCta.label}
                  </button>
                ))}

              {secondaryCta &&
                (secondaryCta.href ? (
                  <a
                    href={secondaryCta.href}
                    className="btn btn-ghost text-white/90"
                    onClick={secondaryCta.onClick}
                  >
                    {secondaryCta.label}
                  </a>
                ) : (
                  <button
                    className="btn btn-ghost text-white/90"
                    onClick={secondaryCta.onClick}
                  >
                    {secondaryCta.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heroheader;
