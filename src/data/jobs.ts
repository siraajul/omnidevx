export interface Job {
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  deadline: string;
  description: string;
  roles: string[];
  skills: string[];
  education: string;
  benefits: string[];
}

export const jobs: Job[] = [
  {
    slug: "senior-frontend-engineer",
    title: "Senior Frontend Engineer",
    department: "Engineering",
    type: "Full-Time",
    location: "Remote",
    salary: "$130k - $160k",
    deadline: "Nov 30, 2026",
    description: "We are looking for an exceptional Senior Frontend Engineer to lead the development of our highly interactive, cinematic user interfaces using React, Next.js, and Framer Motion.",
    roles: [
      "Architect and build high-performance, pixel-perfect user interfaces.",
      "Collaborate with world-class designers to translate Figma concepts into fluid WebGL and React animations.",
      "Optimize web applications for maximum speed and accessibility.",
      "Mentoring junior engineers and leading code reviews."
    ],
    skills: [
      "5+ years of experience with React and TypeScript",
      "Expertise in modern CSS (Tailwind, CSS Modules) and animation libraries (Framer Motion, GSAP)",
      "Deep understanding of web performance optimization",
      "Experience with WebGL or React Three Fiber is a massive plus"
    ],
    education: "B.S. in Computer Science or equivalent practical experience.",
    benefits: [
      "Fully remote work environment",
      "Comprehensive health, dental, and vision insurance",
      "$2,000 annual home office setup stipend",
      "Unlimited PTO with a mandatory 3-week minimum",
      "Equity packages for top performers"
    ]
  },
  {
    slug: "full-stack-architect",
    title: "Full-Stack Architect",
    department: "Engineering",
    type: "Full-Time",
    location: "Hybrid / New York",
    salary: "$160k - $200k",
    deadline: "Dec 15, 2026",
    description: "As a Full-Stack Architect, you will design the core infrastructure that powers our clients' most demanding applications, utilizing edge computing and scalable microservices.",
    roles: [
      "Design scalable, secure, and highly available backend systems.",
      "Establish and maintain engineering standards across multiple full-stack teams.",
      "Evaluate and integrate emerging technologies like Generative AI pipelines.",
      "Lead cross-functional technical planning sessions."
    ],
    skills: [
      "8+ years of software engineering experience",
      "Strong proficiency in Node.js, Go, or Rust",
      "Experience designing distributed systems and microservices architectures",
      "Deep knowledge of AWS, GCP, or Vercel infrastructure"
    ],
    education: "M.S. in Computer Science or equivalent experience.",
    benefits: [
      "Hybrid flexibility with premium co-working passes",
      "Comprehensive health, dental, and vision insurance",
      "Annual technical conference and learning budget",
      "Generous 401(k) matching",
      "Significant equity packages"
    ]
  },
  {
    slug: "lead-ui-ux-designer",
    title: "Lead UI/UX Designer",
    department: "Design",
    type: "Full-Time",
    location: "Remote",
    salary: "$120k - $150k",
    deadline: "Nov 25, 2026",
    description: "We are seeking a visionary Lead UI/UX Designer to craft premium, cinematic, and intuitive digital experiences that push the boundaries of modern web design.",
    roles: [
      "Lead the end-to-end design process from wireframing to high-fidelity prototyping.",
      "Develop and maintain the Omnidevx comprehensive design system.",
      "Collaborate closely with frontend engineers to ensure design implementation is pixel-perfect.",
      "Conduct user research and usability testing to iterate on designs."
    ],
    skills: [
      "Portfolio demonstrating premium, interactive, and modern web designs",
      "Expert-level proficiency in Figma",
      "Strong understanding of user-centered design principles",
      "Experience with micro-animations and interaction design"
    ],
    education: "B.A./B.F.A in Design, HCI, or equivalent practical experience.",
    benefits: [
      "Fully remote work environment",
      "Latest Apple hardware and design software subscriptions",
      "Comprehensive health benefits",
      "Unlimited PTO",
      "Annual design retreat"
    ]
  },
  {
    slug: "ai-solutions-engineer",
    title: "AI Solutions Engineer",
    department: "Product",
    type: "Contract",
    location: "Remote",
    salary: "$80 - $120 / hr",
    deadline: "Rolling",
    description: "Join our Product Innovation team to build and integrate advanced Generative AI capabilities into enterprise SaaS applications using the latest LLMs.",
    roles: [
      "Develop and fine-tune LLM pipelines for specific industry use cases.",
      "Build intelligent agents using LangChain or custom orchestrators.",
      "Work with clients to understand requirements and deliver AI-driven features.",
      "Optimize model inference costs and latency."
    ],
    skills: [
      "Experience with OpenAI APIs, Anthropic, or open-source models (Llama, Mistral)",
      "Strong Python and TypeScript skills",
      "Understanding of RAG architectures and vector databases (Pinecone, Weaviate)",
      "Experience with cloud deployment"
    ],
    education: "Background in Computer Science, Machine Learning, or related field.",
    benefits: [
      "Flexible contract hours",
      "Opportunity to transition to full-time",
      "Access to cutting-edge AI research and tools",
      "Remote work from anywhere"
    ]
  }
];

// Helper to group jobs by department
export const getJobsByDepartment = () => {
  const grouped: Record<string, Job[]> = {};
  jobs.forEach(job => {
    if (!grouped[job.department]) {
      grouped[job.department] = [];
    }
    grouped[job.department].push(job);
  });
  return grouped;
};
