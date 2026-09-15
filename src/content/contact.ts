export const contactEmail = "contact@nong.studio";

export const contactPractices = [
  {
    id: "development",
    label: "IP Development",
    title: "Develop a story.",
    description: "Original stories, characters and screen projects.",
    prompts: [
      "The story, character or project you have in mind",
      "Where you are in its development",
      "What you would like to explore together",
    ],
    opening: "I'd like to explore a story or IP project with NONG Studio.",
    questions: ["The idea or project: ", "Current stage: ", "What we'd like to explore together: "],
  },
  {
    id: "digitalization",
    label: "IP Digitalization",
    title: "Create a digital experience.",
    description: "Collections, cultural assets and interactive worlds.",
    prompts: [
      "The collection, content or IP you are working with",
      "Who the experience is for",
      "What you would like people to explore or do",
    ],
    opening: "I'd like to explore a digital project with NONG Studio.",
    questions: ["The collection, content or IP: ", "Who it's for: ", "The experience we have in mind: "],
  },
  {
    id: "activation",
    label: "IP Activation",
    title: "Connect with audiences.",
    description: "Exhibitions, festivals and cultural partnerships.",
    prompts: [
      "The project and what you hope to achieve",
      "The audience, place or partners you have in mind",
      "Your planned timing, if you know it",
    ],
    opening: "I'd like to explore an exhibition, event or partnership with NONG Studio.",
    questions: ["The project and its goals: ", "Audience, place or partners: ", "Timing, if known: "],
  },
  {
    id: "partnerships",
    label: "Strategic partnerships",
    title: "Become a strategic partner.",
    description: "Creative and technical expertise for shared cultural projects.",
    prompts: [
      "Your studio, team or area of expertise",
      "Relevant work or a portfolio link",
      "How you would like to collaborate with NONG Studio",
    ],
    opening: "I'd like to explore becoming a strategic partner of NONG Studio.",
    questions: ["Our expertise and capabilities: ", "Relevant work or portfolio: ", "How we could collaborate: "],
  },
].map(practice => ({
  ...practice,
  mailto: `mailto:${contactEmail}?subject=${encodeURIComponent(`${practice.label} enquiry`)}&body=${encodeURIComponent([
    "Hi NONG Studio,",
    "",
    practice.opening,
    "",
    "A little about me / us: ",
    "",
    ...practice.questions.flatMap(question => [question, ""]),
    "Best,",
    "",
  ].join("\r\n"))}`,
}));
