export interface ProjectEntry {
  slug: string;
  title: string;
  description: string;
  role: string;
  context: string;
  status: string;
  url: string;
  stack: string[];
  overview: string[];
  contribution: string;
  features: { title: string; body: string }[];
  architecture: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  images: { src: string; alt: string; caption: string }[];
}

export const identity = {
  name: "ramchandra karki",
  role: "full stack developer",
  location: "Pokhara, Nepal",
  email: "iamramchandrakarki@gmail.com",
  github: "https://github.com/iamramchandrakarki",
  linkedin: "https://www.linkedin.com/in/ramchandra-karki-9a2921269/",
  intro: "I’m a full stack developer building web products from interface to database. I work across frontend, backend, and deployment, with care for the details that make software useful.",
};

export const projects: ProjectEntry[] = [
  {
    slug: "drivesro",
    title: "drivesro",
    description: "A driving exam learning platform for Nepali and English speakers in Romania.",
    role: "Design, frontend, backend, deployment",
    context: "Independent client project",
    status: "Live",
    url: "https://www.drivesro.com/",
    stack: ["Next.js", "React", "TypeScript", "NestJS", "PostgreSQL", "Prisma"],
    overview: [
      "Preparing for a driving licence is difficult enough without a language barrier. Drivesro brings Romanian driving exam preparation into a platform that supports Nepali and English, with learning organised around vehicle categories and chapters.",
      "I built the website independently for a client, taking responsibility for the interface, application backend, database, and deployment. It is a complete product, from choosing a course to practising questions and reviewing progress.",
    ],
    contribution: "I was the sole developer. I connected the learning experience to the APIs and data model, built the administration tools behind the content, and delivered the live website to the client.",
    features: [
      { title: "learn by category", body: "Category-based learning for light vehicles, heavy vehicles, and trailers, with chapters that give the question bank a clear structure." },
      { title: "practise and review", body: "Question options, chapter attempts, full exam attempts, and saved progress connect practice sessions to a learner’s account." },
      { title: "manage the content", body: "The administration side supports questions, image assets, imports, and subscriptions, keeping the learning content connected to the product." },
    ],
    architecture: [
      { title: "interface", body: "Next.js and React provide the learning screens. TypeScript keeps the interface and API integrations explicit, while React Query manages server data." },
      { title: "application", body: "A NestJS backend handles application workflows, account sessions, learning content, exam attempts, and subscriptions." },
      { title: "data", body: "PostgreSQL and Prisma model categories, chapters, questions, answers, attempts, and progress as related records." },
    ],
    decisions: [
      { title: "keep grading on the server", body: "The quiz interface receives questions and options, while the backend validates answers. Correct answers stay out of the public question payload. The interface can give feedback without becoming the authority on a learner’s result." },
      { title: "handle repeated payment events", body: "Stripe Checkout and the billing portal connect subscriptions to account access. Webhook handling uses idempotency so a repeated delivery can be recognised instead of applying the same payment event again." },
    ],
    images: [
      { src: "/projects/drivesro-home.webp", alt: "Drivesro homepage showing driving licence categories B, C, and E", caption: "The live homepage. A direct route into category-based learning." },
      { src: "/projects/drivesro-course.webp", alt: "Drivesro sign-in screen with email and Google account options", caption: "Account access before starting a learning session." },
    ],
  },
  {
    slug: "pesha",
    title: "pesha",
    description: "My own job discovery product. Built across the frontend and backend.",
    role: "Product, frontend, backend",
    context: "Personal product",
    status: "Live · alpha",
    url: "https://www.pesha.work/",
    stack: ["Next.js", "React", "TypeScript", "Go", "Chi", "PostgreSQL"],
    overview: [
      "Pesha is my own product for discovering work. The current alpha brings job listings into a focused interface where people can search roles, narrow the list by category, and find the details they need before applying.",
      "I build both the frontend and backend. That means working on the experience people see, the APIs that serve it, and the data behind each listing. The live release is an alpha, and the product is still evolving.",
    ],
    contribution: "I own the frontend and backend development: the Next.js interface, Go API, PostgreSQL integration, and the connection between job discovery and account flows.",
    features: [
      { title: "find a role", body: "Search jobs by role or skill and use category filters to narrow the listings. Pagination keeps the feed manageable." },
      { title: "read the essentials", body: "Each listing brings together the role, company, location, employment type, posting date, and application deadline." },
      { title: "keep it focused", body: "The current release prioritises job discovery. Planned sections are clearly marked as alpha previews in the live product." },
    ],
    architecture: [
      { title: "interface", body: "Next.js, React, and TypeScript power the job feed and account screens, with responsive layouts and light and dark themes." },
      { title: "application", body: "Go and Chi serve the API. Handlers, services, and repositories separate HTTP requests, application rules, and persistence." },
      { title: "data & delivery", body: "PostgreSQL stores the application data through pgx. Docker packages the frontend and backend for deployment." },
    ],
    decisions: [
      { title: "give the job feed its own boundary", body: "The frontend can use a dedicated jobs API independently of the account API. That lets local account development work alongside the live job feed, without tying every screen to the same backend environment." },
      { title: "separate the application rules", body: "The Go backend separates HTTP handlers, services, and repositories. Request handling stays at the edge, application behaviour lives in services, and PostgreSQL access stays in the repository layer." },
    ],
    images: [
      { src: "/projects/pesha-jobs-light-4k.webp", alt: "Pesha job feed in light theme with search, category filters, and job listings", caption: "The live alpha. Search, categories, and the information behind each opportunity." },
    ],
  },
];
