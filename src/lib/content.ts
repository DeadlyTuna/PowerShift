// All page copy lives here, word for word from the Figma Make source.
// Sections import from this file, so wording only ever changes in one place.

export const brand = {
  name: "The Power Shift",
  tagline: "Career growth without personal sacrifice",
  footerLine: "Manisha Agrawal · Leadership Coach",
  symbol: "/power-shift-symbol.webp",
} as const;

/**
 * The live session's start time, as an ISO 8601 string with an offset, for
 * example "2026-12-05T19:00:00+05:30". While this is null the page says
 * "Date announced soon" and the countdown shows no numbers.
 */
export const MASTERCLASS_STARTS_AT: string | null = null;

export const navLinks = [
  { href: "#discover", label: "What you’ll discover" },
  { href: "#about", label: "Meet Manisha" },
  { href: "#faq", label: "FAQ" },
] as const;

export const navCta = "Reserve my seat!";

export const hero = {
  eyebrow: "Free live masterclass for women with 12 years or more of experience",
  title: "You’ve worked hard for years.",
  titleAccent: "So why does your career still feel stuck?",
  lead: "Discover three powerful shifts to break free from overthinking, self-doubt and career stagnation—without sacrificing your peace, relationships or joy. The longer you wait for perfect clarity, the more opportunities can pass unnoticed.",
  cta: "Reserve my free seat!",
  format: "Live on Zoom",
  formatDetail: "Date announced soon · Free to attend",
  hostMonogram: "MA",
  hostPrefix: "With",
  hostName: "Manisha Agrawal",
  hostRole: "Leadership Coach · 20 years corporate experience",
  quote: "You’re Just One Shift Away.",
  image: {
    src: "/manisha-hero.webp",
    alt: "Manisha Agrawal, leadership coach",
    width: 1448,
    height: 1086,
  },
} as const;

export const recognition = {
  eyebrow: "Does this feel familiar?",
  title: "You’ve come so far.",
  titleAccent: "So why aren’t you moving forward?",
  lead: "On paper, you are doing well. Deep inside, you know you are capable of so much more.",
  struggles: [
    {
      title: "You feel stagnant",
      copy: "You’re putting in the effort, but the growth and opportunities aren’t following.",
    },
    {
      title: "You overthink everything",
      copy: "You analyse, question and imagine what could go wrong until action feels overwhelming.",
    },
    {
      title: "You doubt your readiness",
      copy: "Despite years of experience, you wonder whether you are capable enough for the next level.",
    },
    {
      title: "You hold back your voice",
      copy: "You have valuable ideas, but don’t always know how to communicate your value.",
    },
    {
      title: "Your dreams keep waiting",
      copy: "You keep telling yourself you will focus on what you want once things settle down.",
    },
    {
      title: "You come last",
      copy: "Between work, family and responsibilities, your own needs stay at the bottom of the list.",
    },
  ],
  closing:
    "You know what you should be doing. But somehow, you keep falling back into the same patterns. Don’t let another season pass while you wait to feel completely ready.",
  cta: "Yes, I’m ready to move forward!",
} as const;

export const cost = {
  eyebrow: "The hidden cost",
  title: "Feeling stuck affects more than",
  titleAccent: "your career.",
  lead: "Over time, it quietly touches the things that matter most—the way you feel, the way you trust yourself and the way you connect with others.",
  items: [
    {
      title: "Your Calm",
      copy: "Your mind rarely switches off. Even at home, you replay conversations, question decisions and carry the noise of the day.",
    },
    {
      title: "Your Confidence",
      copy: "Every big decision comes with a hundred questions. The longer you hesitate, the harder it becomes to trust yourself.",
    },
    {
      title: "Your Connections",
      copy: "Managing everything leaves little energy for the people you love—or for your own interests, dreams and happiness.",
    },
  ],
} as const;

export const possibility = {
  eyebrow: "A different way forward",
  title: "Imagine if your next level didn’t require",
  titleAccent: "more sacrifice.",
  lead: "Imagine feeling excited about your future again—not because every challenge has disappeared, but because you trust yourself to navigate what comes.",
  prose: [
    "Know what you want and where you are going. Make decisions without endlessly second-guessing yourself, and speak up so your contribution becomes visible.",
    "Pursue opportunities before you feel perfectly ready. Set healthier boundaries without the guilt, and grow while staying connected to yourself and your family.",
  ],
} as const;

export const pillars = {
  eyebrow: "Inside the masterclass",
  title: "Discover the 3 pillars to become",
  titleAccent: "unstoppable.",
  lead: "The three shifts that will help you stop living on autopilot and start creating a life of clarity, confidence and meaningful growth.",
  items: [
    {
      label: "Pillar 1",
      title: "Purpose",
      subtitle: "Stop chasing expectations. Start living what matters.",
      copy: "Discover what truly matters to YOU, reconnect with your core values and uncover the deeper WHY behind your choices—so you’re not just working hard, but moving toward a life that feels meaningful and fulfilling.",
      takeaway: "Purpose gives you direction.",
    },
    {
      label: "Pillar 2",
      title: "Power",
      subtitle: "Stop giving away your power. Start trusting yourself.",
      copy: "Discover how fear, self-doubt and the need for approval quietly hold you back—and what it takes to build the confidence, courage and inner strength to speak up, make decisions and stand up for yourself.",
      takeaway: "Power gives you the courage.",
    },
    {
      label: "Pillar 3",
      title: "Progress",
      subtitle: "Stop waiting to feel ready. Start making things happen.",
      copy: "Discover how perfectionism, procrastination and overthinking keep even capable women stuck—and how to move beyond these patterns to take bold, massive action toward the goals that matter to you.",
      takeaway: "Progress turns your dreams into reality.",
    },
  ],
  summary:
    "Purpose gives you direction. Power gives you the courage. Progress turns your dreams into reality.",
  summaryDetail:
    "Together, they help you move from simply managing your life to leading it.",
  cta: "Discover the 3 pillars!",
} as const;

export const outcomes = {
  eyebrow: "What you can take away",
  title: "Less busy. More",
  titleAccent: "intentional.",
  lead: "Begin moving towards three outcomes that matter far beyond your job title.",
  items: [
    {
      title: "Calm",
      copy: "A quieter mind and a greater ability to handle pressure without feeling constantly overwhelmed.",
      visualLabel: "A quiet sun resting above calm, flowing lines",
    },
    {
      title: "Confidence",
      copy: "Greater trust in yourself to make decisions, speak up and pursue meaningful opportunities.",
      visualLabel: "A flame-shaped arrow rising above a flowing line",
    },
    {
      title: "Freedom",
      copy: "More freedom to choose, act, set boundaries and enjoy your life without fear or guilt driving you.",
      visualLabel: "An open circular form with flowing lines moving freely beyond it",
    },
  ],
  manifesto: "Because success should feel meaningful on the inside,",
  manifestoAccent: "not just look impressive on the outside.",
} as const;

export const about = {
  eyebrow: "Meet your coach",
  title: "I was achieving my goals.",
  titleAccent: "But I was losing my peace.",
  image: {
    src: "/manisha-coach.webp",
    alt: "Manisha Agrawal standing in a bright lobby, wearing a navy blazer and white trousers",
    width: 1086,
    height: 1448,
  },
  quote: "I didn’t have to become less ambitious to become happier.",
  quoteAuthor: "Manisha Agrawal",
  storyBefore:
    "For nearly 20 years, I built my career in the corporate world. I was ambitious, hardworking and results-driven. I delivered projects, achieved goals and took on responsibility.",
  feedbackLead:
    "Then my boss gave me feedback that changed the way I looked at leadership:",
  feedbackQuote: "“You’ve achieved your goals. But your team feels left behind.”",
  storyAfter: [
    "That moment began a journey into Agile Coaching, mindset, communication and relationships. I learned that I could grow professionally without losing myself along the way.",
    "Today, I help ambitious working women reconnect with their confidence, move towards meaningful growth and create more space for the people and things that matter most.",
  ],
  credentials: [
    { value: "20 years", label: "Corporate experience" },
    { value: "Leadership", label: "& Agile coaching" },
    { value: "Practical", label: "Mindset-led approach" },
  ],
} as const;

export const fit = {
  yes: {
    eyebrow: "This is for you if...",
    title: "You are ready to explore a different way forward.",
    paragraphs: [
      "You’re an ambitious working woman with 12+ years of experience who feels stuck, stagnant or unsure about your next move.",
      "You may be navigating overthinking, self-doubt or difficult decisions. You want to speak up, create greater visibility and grow without losing your peace or relationships along the way.",
    ],
  },
  no: {
    eyebrow: "This is not for you if...",
    title: "You are looking for a shortcut.",
    paragraphs: [
      "This is not a promise of guaranteed promotions or job placements. It is not technical skills training.",
      "It is for women willing to reflect honestly on their patterns, choices and possibilities.",
    ],
    closing:
      "You don’t need to have everything figured out. You just need to be willing to begin.",
  },
} as const;

export const masterclass = {
  eyebrow: "Your masterclass details",
  title: "Your next chapter can begin with",
  titleAccent: "one decision.",
  lead: "Bring a notebook, an open mind and a willingness to explore your next level.",
  details: [
    { label: "Format", value: "Live on Zoom" },
    { label: "Date & time", value: "Announced soon · IST" },
    { label: "Investment", value: "Free" },
  ],
  card: {
    kicker: "From stuck to unstoppable",
    title: "Claim your free place",
    copy: "Your next opportunity may arrive before you feel ready. Join the masterclass now so you can meet it with greater clarity, confidence and courage—not another round of hesitation.",
    cta: "Reserve my free seat!",
    note: "Joining instructions will be shared after registration.",
  },
} as const;

/** Form wording. This is the only copy not in the Figma source, because the source had no form. */
export const registration = {
  nameLabel: "Your name",
  emailLabel: "Your email",
  pending: "Reserving your seat…",
  successTitle: "Your seat is reserved.",
  successCopy: "Joining instructions will be shared after registration.",
  errorInvalidName: "Please enter your name.",
  errorInvalidEmail: "Please enter a valid email address.",
  errorUnavailable:
    "We couldn’t reserve your seat just now. Please try again in a few minutes.",
  previewBadge: "Preview: not saved",
} as const;

export const faq = {
  eyebrow: "Questions, answered",
  title: "Everything you need to know.",
  lead: "Still have a question? Reach out and we will help you decide if the session is right for you.",
  items: [
    {
      question: "Why should I join now instead of waiting?",
      answer:
        "Because waiting for perfect clarity can quietly become another year of the same patterns. If this page feels familiar, use the masterclass as your checkpoint: step out of autopilot, understand what is holding you back and begin building momentum while your goals still matter deeply to you.",
    },
    {
      question: "How is this different from other trainings?",
      answer:
        "This masterclass focuses on the Purpose, Power and Progress shifts that influence how you use the knowledge and skills you already have.",
    },
    {
      question: "Is this only for women already in leadership?",
      answer:
        "No. It’s for ambitious, experienced working women who want to grow—whether they already lead teams or aspire to bigger roles.",
    },
    {
      question: "Is 12 years of work experience a must?",
      answer:
        "No. If you are a working professional ready to accelerate your career growth and take meaningful ownership of your next move, you are welcome to join.",
    },
    {
      question: "I am a student. Can I join?",
      answer:
        "This masterclass is not designed for students. Its conversations, examples and actions are created for working professionals navigating real career decisions, workplace visibility and leadership growth.",
    },
    {
      question: "What if I don’t know what I want next?",
      answer:
        "That’s completely fine. The Purpose pillar explores what matters to you and how you can begin reconnecting with your direction.",
    },
    {
      question: "Will I get a promotion or a new job?",
      answer:
        "No, this programme does not guarantee a job placement or promotion. It is designed to strengthen the mindset, self-trust, visibility and action-oriented identity that help you recognise opportunities, communicate your value and accelerate your own growth—instead of waiting for someone else to create your next move.",
    },
    {
      question: "Will I have to share personal experiences?",
      answer:
        "No. You can participate at your own comfort level and reflect privately during activities.",
    },
    {
      question: "Is the masterclass really free?",
      answer: "Yes. The live masterclass is completely free to attend.",
    },
  ],
} as const;

export const finalCta = {
  eyebrow: "You’re one shift away",
  title: "You’ve spent years building your career.",
  titleAccent: "Now step into the growth you truly want.",
  lead: "Your next level begins with one intentional decision. The cost of waiting is not only time—it is every opportunity you remain too uncertain to claim.",
  cta: "Yes, reserve my free seat!",
} as const;

export const countdown = {
  label: "GOING LIVE SOON!",
  dateUnset: "Date announced soon",
  units: { days: "Days", hours: "Hours", minutes: "Minutes" },
} as const;
