export const introContent = {
  overview: "We develop original IP, build digital experiences and connect culture with audiences.",
  approach: "NONG Studio works across three core practices: IP Development, IP Digitalization and IP Activation. Each can stand alone or connect as a project grows.",
  practices: [
    {
      id: "development",
      label: "Development",
      description: "We develop original films, series and story worlds, and work with creators to turn a distinctive voice into lasting entertainment IP.",
      capabilities: [
        "Worldbuilding & character development",
        "Film, documentary & series production",
        "Creator partnerships & cross-media development",
      ],
      image: "/assets/intro/round-01/development.webp",
      video: "/assets/intro/round-01/development.mp4",
      alt: "Concept scene of a film crew recording an actor on a warmly lit set.",
    },
    {
      id: "digitalization",
      label: "Digitalization",
      description: "We turn cultural collections and creative material into organized digital assets, online exhibitions and interactive experiences that can be explored and reused.",
      capabilities: [
        "Asset libraries, rights & version records",
        "Digital exhibitions & 3D exploration",
        "AI-assisted creation & interactive prototypes",
      ],
      image: "/assets/intro/round-03/digitalization.webp",
      video: "/assets/intro/round-03/digitalization.mp4",
      alt: "Concept scene of an intricately ornamented bronze vessel rotating beside its corresponding 3D model on a conservation-studio monitor.",
    },
    {
      id: "activation",
      label: "Activation",
      description: "We bring IP into public life through exhibitions, festivals and ongoing programs, connecting audiences, places and partners beyond a single event.",
      capabilities: [
        "Curation & public programs",
        "City festivals & sports entertainment",
        "Distribution, licensing & brand partnerships",
      ],
      image: "/assets/intro/round-02/activation.webp",
      video: "/assets/intro/round-02/activation.mp4",
      alt: "Concept scene of visitors exploring an exhibition with displays and large-scale projections.",
    },
  ],
  partners: [
    { label: "Museums & collections", icon: "museum" },
    { label: "Creators & talent", icon: "creator" },
    { label: "Entertainment IP", icon: "entertainment" },
    { label: "Cities & venues", icon: "city" },
  ],
  collaboration: "From a first concept or prototype to a public launch and ongoing program, we shape the scope around your project.",
} as const;
