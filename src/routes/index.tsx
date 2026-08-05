import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Dumbbell, MapPin, Star, ArrowRight, Navigation } from "lucide-react";
import { GYM, GYM_HOURS, FACILITIES, REVIEWS, PLANS } from "@/lib/gym-data";
import heroImg from "@/assets/gym-hero.jpg";
import strengthImg from "@/assets/gym-strength.jpg";
import cardioImg from "@/assets/gym-cardio.jpg";
import trainerImg from "@/assets/gym-trainer.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Workout Zone — Gym in Fatehpur, Uttar Pradesh" },
      {
        name: "description",
        content:
          "The Workout Zone in Khaleel Nagar, Awas Vikas, Fatehpur — full free-weights and cardio floor, supportive trainers, affordable membership. Open Mon–Sat.",
      },
      { property: "og:title", content: "The Workout Zone — Gym in Fatehpur" },
      {
        property: "og:description",
        content: "Strength, cardio and coaching in Khaleel Nagar, Fatehpur. Rated 4.9 by members.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GymHome,
});

function GymHome() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: GYM.legalName,
    address: {
      "@type": "PostalAddress",
      streetAddress: GYM.addressLine,
      addressLocality: GYM.city,
      addressRegion: GYM.region,
      postalCode: GYM.postalCode,
      addressCountry: GYM.country,
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: GYM.rating, reviewCount: GYM.reviewCount },
    url: GYM.mapsUrl,
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <header className="border-b border-border bg-card/70 backdrop-blur sticky top-0 z-20">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="font-display text-xl tracking-wider flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-ember" />
            THE WORKOUT <span className="text-ember">ZONE</span>
          </a>
          <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
            <a href="#facilities" className="px-3 py-1.5 rounded-md hover:bg-secondary">Facilities</a>
            <a href="#timings" className="px-3 py-1.5 rounded-md hover:bg-secondary">Timings</a>
            <a href="#reviews" className="px-3 py-1.5 rounded-md hover:bg-secondary">Reviews</a>
            <a href="#visit" className="px-3 py-1.5 rounded-md hover:bg-secondary">Visit</a>
          </div>
          <a
            href={GYM.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Get directions
          </a>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative">
          <img
            src={heroImg}
            alt="Bright training floor at The Workout Zone gym in Fatehpur with dumbbell racks and treadmills"
            width={1920}
            height={1088}
            className="h-[62vh] min-h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto max-w-6xl px-4 w-full">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-ember mb-3">
                  <MapPin className="h-3.5 w-3.5" /> {GYM.addressLine}, {GYM.city}
                </div>
                <h1 className="font-display text-5xl md:text-7xl leading-[0.95]">
                  Train hard.
                  <br />
                  Right here in {GYM.city}.
                </h1>
                <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl">
                  {GYM.tagline}. Complete free-weights and cardio setup, trainers who actually coach you, and a
                  membership that doesn't sting.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={GYM.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    <Navigation className="h-4 w-4" /> Visit the gym
                  </a>
                  <a
                    href="#facilities"
                    className="inline-flex items-center gap-2 rounded-md border border-input bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    See the floor <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm">
                  <span className="flex text-ember">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                  <span className="font-medium">{GYM.rating}</span>
                  <span className="text-muted-foreground">· {GYM.reviewCount} Google reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section id="facilities" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-4xl md:text-5xl">What's on the floor</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Everything for a serious push/pull/legs week — plus the cardio and mobility space to recover between
            sessions.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                <div className="font-display text-2xl">{f.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { src: strengthImg, alt: "Loaded barbell in a squat rack at The Workout Zone" },
              { src: cardioImg, alt: "Treadmills and cycles on the cardio floor" },
              { src: trainerImg, alt: "Trainer coaching a member at The Workout Zone" },
            ].map((img) => (
              <img
                key={img.alt}
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={1200}
                height={900}
                className="h-56 w-full rounded-xl border border-border object-cover"
              />
            ))}
          </div>
        </section>

        {/* Timings + plans */}
        <section id="timings" className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-ember" />
                <h2 className="font-display text-4xl">Timings</h2>
              </div>
              <ul className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                {GYM_HOURS.map((h) => (
                  <li key={h.day} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="font-medium">{h.day}</span>
                    <span className={h.closed ? "text-muted-foreground" : "text-ember font-medium"}>{h.hours}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Morning and evening batches run daily. Call ahead on public holidays.
              </p>
            </div>

            <div>
              <h2 className="font-display text-4xl mb-4">Membership</h2>
              <div className="space-y-3">
                {PLANS.map((p) => (
                  <div
                    key={p.name}
                    className={`rounded-xl border bg-card p-5 flex items-center justify-between gap-4 ${
                      p.highlight ? "border-ember shadow-sm" : "border-border"
                    }`}
                  >
                    <div>
                      <div className="font-display text-2xl">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.note}</div>
                    </div>
                    {p.highlight && (
                      <span className="text-xs uppercase tracking-wider text-ember font-medium">Popular</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Members consistently call the fee the best value in Fatehpur. Walk in for current rates and a free look
                around the floor.
              </p>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-4xl md:text-5xl">What members say</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r) => (
              <blockquote key={r.name} className="rounded-xl border border-border bg-card p-5">
                <div className="flex text-ember mb-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm">{r.text}</p>
                <footer className="mt-3 text-xs text-muted-foreground">— {r.name}, Google review</footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 lg:grid-cols-2 items-start">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">Find us</h2>
              <p className="mt-3 text-lg">{GYM.fullAddress}</p>
              <p className="mt-1 text-sm text-muted-foreground">{GYM.landmark}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={GYM.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Navigation className="h-4 w-4" /> Directions
                </a>
                <a
                  href={GYM.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-card px-5 py-2.5 text-sm font-medium hover:bg-accent"
                >
                  <Star className="h-4 w-4" /> Google listing
                </a>
              </div>
              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <div className="font-display text-2xl">Members' training area</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track your split, log every set and ask the AI coach questions — sign in to your personal plan.
                </p>
                <Link
                  to="/today"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-ember hover:underline"
                >
                  Open my plan <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <iframe
              title={`Map showing ${GYM.legalName} in ${GYM.city}`}
              src={GYM.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full rounded-xl border border-border"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
