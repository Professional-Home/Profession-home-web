export type StartupStage = 'Idea' | 'Validated' | 'Prototype' | 'MVP' | 'Early Traction' | 'Growth';

export interface AssessmentResult {
  problemValidation: number;   // 15%
  customerValidation: number;  // 20%
  productReadiness: number;    // 15%
  marketOpportunity: number;   // 10%
  businessModel: number;       // 10%
  teamStrength: number;        // 10%
  financialHealth: number;      // 10%
  executionGrowth: number;     // 10%
  overallScore: number;
  diagnosis: string;
  recommendations: string[];
  strengths?: string[];
  risks?: string[];
  recommendedActions?: string[];
}

export interface Question {
  id: number;
  text: string;
  category: keyof Omit<AssessmentResult, 'overallScore' | 'diagnosis' | 'recommendations'>;
  options: {
    label: string;
    score: number; // 0 to 10
  }[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  locked: boolean;
  description: string;
}

export interface RoadmapPhase {
  id: number;
  phaseName: string;
  progress: number;
  milestones: Milestone[];
  targetDuration: string;
  iconName: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  deadline: string;
  progress: number;
  category: 'Daily' | 'Weekly' | 'Team';
  aiSuggestion?: string;
}

export interface DocumentInfo {
  id: string;
  name?: string;
  type: 'Pitch Deck' | 'Financial Model' | 'Business Plan' | 'Market Research' | 'Investor QA';
  status: 'Empty' | 'Analyzing' | 'Completed' | 'Uploaded';
  size?: string;
  uploadedAt?: string;
  score?: number; // Investor readiness score 0-100
  slideFeedback?: {
    slide: string | number;
    title: string;
    strengths: string[];
    gaps: string[];
    improvements: string;
  }[];
  generalFeedback?: string;
}

export interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  actionPlan?: string[];
}

export interface AchievementBadge {
  id: string;
  dbId?: string;
  title: string;
  description: string;
  category: 'Assessment' | 'Docs' | 'Roadmap' | 'Tasks' | 'AI' | 'Community';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  points: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  domain: string;
  description: string;
  experience: string;
  rating: number;
  freeDate: string;
  paidFee: string;
  photoUrl: string;
  tags: string[];
}

export interface BlogCardInfo {
  id: string;
  title: string;
  category: string;
  readTime: string;
  imageUrl: string;
  url: string;
  excerpt: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  votes: number;
  replies: number;
}

export interface MatchingProfile {
  id: string;
  name: string;
  role: string;
  stage: string;
  seeking: string;
  skills: string[];
  avatar: string;
}

export interface StartupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  speakers: string[];
  attendees: number;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  startup: string;
  points: number;
  badgeCount: number;
  avatar: string;
}

// Global default datasets for startup simulation
export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is your startup's current development stage?",
    category: "executionGrowth",
    options: [
      { label: "Just an idea / scribbled on a napkin", score: 2 },
      { label: "Validated concept with some customer interviews", score: 5 },
      { label: "Working prototype / landing page tested", score: 7 },
      { label: "MVP fully functional and used by beta testers", score: 9 },
      { label: "Traction: Scaling paying customers & core metrics", score: 10 }
    ]
  },
  {
    id: 2,
    text: "What is the primary motivation driving your founding team?",
    category: "teamStrength",
    options: [
      { label: "Making quick money or riding a trend", score: 3 },
      { label: "Personal freedom / being our own boss", score: 6 },
      { label: "Deep sector experience & obsession with solving a specific customer pain", score: 10 }
    ]
  },
  {
    id: 3,
    text: "How many structured, open-ended customer interviews have you conducted?",
    category: "customerValidation",
    options: [
      { label: "None - we know exactly what is needed already", score: 1 },
      { label: "1 to 10 - mostly friends and family", score: 4 },
      { label: "10 to 30 - non-biased prospective users", score: 7 },
      { label: "30 to 50+ - extensive validation across customer cohorts", score: 10 }
    ]
  },
  {
    id: 4,
    text: "What gives you confidence that your proposed solution is correct?",
    category: "problemValidation",
    options: [
      { label: "Gut feeling and personal conviction", score: 2 },
      { label: "Competitors are doing something similar successfully", score: 5 },
      { label: "Users actively trying to build makeshift solutions using spreadsheets/workarounds", score: 10 }
    ]
  },
  {
    id: 5,
    text: "What is currently your startup's single biggest challenge?",
    category: "executionGrowth",
    options: [
      { label: "Defining the product scope / getting code written", score: 5 },
      { label: "Finding first pilot clients or user acquisition channels", score: 7 },
      { label: "Pitching investors and raising capital", score: 8 },
      { label: "Expanding the engineering, design, or sales team", score: 9 }
    ]
  },
  {
    id: 6,
    text: "How would you describe the current founder situation?",
    category: "teamStrength",
    options: [
      { label: "Solo founder doing everything part-time", score: 4 },
      { label: "Solo founder doing it full-time", score: 6 },
      { label: "Complementary co-founders (e.g. Tech + Sales) working full-time", score: 10 }
    ]
  },
  {
    id: 7,
    text: "What is the status of your product / software code?",
    category: "productReadiness",
    options: [
      { label: "No product yet - designs or pitch deck only", score: 2 },
      { label: "Figma interactive clickable prototype built", score: 5 },
      { label: "MVP fully built but contains high technical debt", score: 8 },
      { label: "Stable product with continuous deployment and low bug count", score: 10 }
    ]
  },
  {
    id: 8,
    text: "What is the current total size of your startup team?",
    category: "teamStrength",
    options: [
      { label: "Only 1 (Myself)", score: 4 },
      { label: "2 - 3 core team members", score: 8 },
      { label: "4 - 8 members including core engineers/growth designers", score: 10 }
    ]
  },
  {
    id: 9,
    text: "What level of mentor or active advisory board support do you have?",
    category: "marketOpportunity",
    options: [
      { label: "No mentors or advisors connected yet", score: 3 },
      { label: "Casual chats with general business advisors", score: 6 },
      { label: "Dedicated advisors with deep domain experience holding equity/vesting", score: 10 }
    ]
  },
  {
    id: 10,
    text: "What is your team's biggest continuous fear?",
    category: "marketOpportunity",
    options: [
      { label: "A massive tech giant copies our features", score: 5 },
      { label: "Not reaching enough customers before our money runs out", score: 8 },
      { label: "Building something that absolutely nobody wants or will pay for", score: 10 }
    ]
  },
  {
    id: 11,
    text: "What is your startup's current revenue status?",
    category: "financialHealth",
    options: [
      { label: "Zero pre-revenue / no monetization path set yet", score: 3 },
      { label: "Active pilot/letters of intent but no direct cash flow yet", score: 6 },
      { label: "Generating initial revenue (e.g. up to ₹1,000 - ₹50,000 per month)", score: 8 },
      { label: "Predictable monthly recurring revenue with high customer retention", score: 10 }
    ]
  },
  {
    id: 12,
    text: "How clear is your business model and monetization strategy?",
    category: "businessModel",
    options: [
      { label: "Very ambiguous - we will think about monetization later", score: 2 },
      { label: "General idea (e.g. subscription) but pricing tier is unvalidated", score: 6 },
      { label: "Unit economics fully mapped: LTV, CAC, margins are documented & proved", score: 10 }
    ]
  },
  {
    id: 13,
    text: "To get ₹25 Lakhs investment, what is your team's top priority use of funds?",
    category: "financialHealth",
    options: [
      { label: "Pay comfortable salaries to founders", score: 3 },
      { label: "Hire marketing agency & run heavily funded social media ads", score: 5 },
      { label: "Build MVP / secure critical hires & run hyper-focused validation pilots", score: 10 }
    ]
  },
  {
    id: 14,
    text: "What is your current most critical execution need?",
    category: "executionGrowth",
    options: [
      { label: "Figuring out the technical architecture & tech stack", score: 6 },
      { label: "Developing a reliable pricing model & B2B slide pipeline", score: 8 },
      { label: "Finding high-quality mentors, engineers, or early advocates", score: 10 }
    ]
  },
  {
    id: 15,
    text: "Which of the following best represents your current journey stage?",
    category: "problemValidation",
    options: [
      { label: "Studying the market and learning basic business skills", score: 4 },
      { label: "Iterating on feedback and looking for a repeatable marketing loop", score: 8 },
      { label: "Executing intensely and standardizing our tech operations", score: 10 }
    ]
  }
];

export const DEFAULT_ROADMAP: RoadmapPhase[] = [
  {
    id: 1,
    phaseName: "Phase 1: Problem Discovery",
    progress: 75,
    targetDuration: "Weeks 1 - 3",
    iconName: "Search",
    milestones: [
      { id: "m1-1", title: "Problem Defined", completed: true, locked: false, description: "Draft a clear, quantified description of the core bottleneck which users struggle with." },
      { id: "m1-2", title: "Customer Segment Identification", completed: true, locked: false, description: "Define a hyper-specific initial target profile (your beachhead customer)." },
      { id: "m1-3", title: "Competitor Research Matrix", completed: true, locked: false, description: "Analyze the pricing, gaps, and features of the top 3 alternative solutions." },
      { id: "m1-4", title: "Unique Value Proposition", completed: false, locked: false, description: "Formulate a one-sentence pitch stating why your solution is strictly superior." }
    ]
  },
  {
    id: 2,
    phaseName: "Phase 2: Customer Validation",
    progress: 40,
    targetDuration: "Weeks 4 - 6",
    iconName: "UserCheck",
    milestones: [
      { id: "m2-1", title: "First 10 Interviews", completed: true, locked: false, description: "Conduct 10 open-ended discussions about their struggles – strictly no pitching!" },
      { id: "m2-2", title: "First 25 Interviews", completed: false, locked: false, description: "Validate problem patterns across 25 high-intent prospective users." },
      { id: "m2-3", title: "First 50 Interviews", completed: false, locked: true, description: "Broaden understanding to reveal user pricing thresholds." },
      { id: "m2-4", title: "Customer Structured Survey", completed: false, locked: true, description: "Gather quantitative validation statistics from 100+ responses." },
      { id: "m2-5", title: "Problem-Solution Fit Confirmed", completed: false, locked: true, description: "Document patterns demonstrating users are highly frustrated with alternatives." }
    ]
  },
  {
    id: 3,
    phaseName: "Phase 3: Product Development",
    progress: 0,
    targetDuration: "Weeks 7 - 10",
    iconName: "Code",
    milestones: [
      { id: "m3-1", title: "Lo-Fi Clickable Prototype", completed: false, locked: true, description: "Build Figma screens showing critical user flows." },
      { id: "m3-2", title: "Working MVP Minimum Spec", completed: false, locked: true, description: "Limit features purely to the core value-adding transaction." },
      { id: "m3-3", title: "Alpha/Beta Security Testing", completed: false, locked: true, description: "Deploy basic user authentication and clean database access." },
      { id: "m3-4", title: "Continuous User Feedback Loop", completed: false, locked: true, description: "Embed hotkeys or feedback input forms directly inside your utility." }
    ]
  },
  {
    id: 4,
    phaseName: "Phase 4: Market Entry",
    progress: 0,
    targetDuration: "Weeks 11 - 14",
    iconName: "Rocket",
    milestones: [
      { id: "m4-1", title: "First Pilot Customer Secured", completed: false, locked: true, description: "Get a high-intent user to commit to a 30-day pilot validation." },
      { id: "m4-2", title: "First 5 Active Customers", completed: false, locked: true, description: "Prove retention over their first 14 days of software usage." },
      { id: "m4-3", title: "First Paying Client Signed", completed: false, locked: true, description: "Confirm the pricing hypothesis by securing cold hard revenue." },
      { id: "m4-4", title: "First ₹10,000 Revenue Generated", completed: false, locked: true, description: "Validate standard commercial sales/billing cycles." }
    ]
  },
  {
    id: 5,
    phaseName: "Phase 5: Growth & Unit Economics",
    progress: 0,
    targetDuration: "Weeks 15 - 18",
    iconName: "TrendingUp",
    milestones: [
      { id: "m5-1", title: "First ₹1 Lakh Monthly Revenue", completed: false, locked: true, description: "Unlock scalable commercial traction with a structured marketing pipeline." },
      { id: "m5-2", title: "Channel Partnership Unlocked", completed: false, locked: true, description: "Partner with a community, newsletter, or platform to distribute your product." },
      { id: "m5-3", title: "Engineering / Growth Hires", completed: false, locked: true, description: "Onboard dedicated sales or backend engineers to handle incoming pipeline." }
    ]
  },
  {
    id: 6,
    phaseName: "Phase 6: Investment Readiness",
    progress: 0,
    targetDuration: "Weeks 19+",
    iconName: "DollarSign",
    milestones: [
      { id: "m6-1", title: "Polished Investor Pitch Deck", completed: false, locked: true, description: "Build a 10-slide deck outlining problem, solution, size, and team." },
      { id: "m6-2", title: "5-Year Bottom-Up Financial Model", completed: false, locked: true, description: "Formulate rigorous pricing, staff costs, CAC, and cash run estimate." },
      { id: "m6-3", title: "Secure Data Room Ready", completed: false, locked: true, description: "Prepare incorporation docs, IP assignments, and capillary data." },
      { id: "m6-4", title: "First 10 Seed Investor Meetings", completed: false, locked: true, description: "Pitch leading institutional micro-VCs and active angels." }
    ]
  }
];

export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Draft beachhead customer persona statement",
    description: "Define the specific age, job, role, budget size, and struggles of our primary buyer group.",
    status: "To Do",
    priority: "High",
    assignedTo: "Rahul",
    deadline: "2026-06-20",
    progress: 0,
    category: "Daily",
    aiSuggestion: "Focus heavily on quantifying their current time wasted. Instead of 'Marketing managers', refine to 'Mid-sized B2B SaaS Growth Marketers spending >$2k/mo on ads with poor conversion.'"
  },
  {
    id: "task-2",
    title: "Conduct 5 open-ended user interview calls",
    description: "Do not mention our product. Ask about their current manual workflow and what frustrates them.",
    status: "In Progress",
    priority: "High",
    assignedTo: "Karan",
    deadline: "2026-06-22",
    progress: 40,
    category: "Weekly",
    aiSuggestion: "Anchor questions on past behaviors: 'When was the last time you tried to solve this?' and 'How much did you spend?' rather than asking speculative questions like 'Would you buy this?'"
  },
  {
    id: "task-3",
    title: "Gather landing page analytics & click-through rates",
    description: "Evaluate active traffic source and check if users are clicking the waitlist CTA.",
    status: "Review",
    priority: "Medium",
    assignedTo: "Rahul",
    deadline: "2026-06-19",
    progress: 85,
    category: "Daily",
    aiSuggestion: "Analyze scroll depth to verify if visitors are exiting before reviewing the primary feature checklist. Set up Hotjar or clear events tracking."
  },
  {
    id: "task-4",
    title: "Finalize competitor feature audit grid",
    description: "Outline the key strengths and weaknesses of alternative tools currently in the market.",
    status: "Completed",
    priority: "Medium",
    assignedTo: "Sneha",
    deadline: "2026-06-15",
    progress: 100,
    category: "Team",
    aiSuggestion: "Excellent work! Group competitors by 'Direct Software alternatives' vs 'Indirect workarounds (e.g. general Excel spreadsheets/WhatsApp chains)' to emphasize the friction of alternatives."
  },
  {
    id: "task-5",
    title: "Benchmark typical dev server performance",
    description: "Ensure the local environment renders in under 500ms.",
    status: "To Do",
    priority: "Low",
    assignedTo: "Sneha",
    deadline: "2026-06-25",
    progress: 0,
    category: "Daily"
  }
];

export const DEFAULT_DOCUMENTS: DocumentInfo[] = [
  {
    id: "doc-1",
    name: "Startup_Master_PitchDeck_v2.pdf",
    type: "Pitch Deck",
    status: "Completed",
    size: "4.8 MB",
    uploadedAt: "2026-06-16 14:32",
    score: 78,
    slideFeedback: [
      {
        slide: 1,
        title: "Title & Hook",
        strengths: ["Clear minimalist layout", "Strong, simple tagline stating product value proposition"],
        gaps: ["No direct contact info of team", "Missed opportunity to state your beachhead category right away"],
        improvements: "Include the name, sector focus, and brief contact coordinates in the bottom footer."
      },
      {
        slide: 2,
        title: "Problem Statement",
        strengths: ["Highly visual presentation", "Uses emotional connection to show developer frustration"],
        gaps: ["Lacks clear data backing the problem", "Does not quantify the annual wasted engineering dollars"],
        improvements: "Add a prominent stat: 'Developers spend 12 hours/week debugging manual server routes, costing mid-sized firms $18k active developer cost annually.'"
      },
      {
        slide: 3,
        title: "Market Opportunity (TAM/SAM/SOM)",
        strengths: ["Bottom-up calculations shown clearly"],
        gaps: ["The TAM is overly generic ($45B universal software debuggers)"],
        improvements: "Narrow TAM initially to 'Indian & US B2B SaaS debuggers' ($1.2B) to show high immediate commercial capture realism."
      }
    ],
    generalFeedback: "Overall, the layout is highly professional and visual. To push the score to 90+, you need to replace generic market projections with concrete ground-up CAC/LTV assertions and show customer validation proof metrics on your solutions slide."
  },
  {
    id: "doc-2",
    name: "Five_Year_Financial_Projection.xlsx",
    type: "Financial Model",
    status: "Completed",
    size: "1.2 MB",
    uploadedAt: "2026-06-17 09:15",
    score: 82,
    slideFeedback: [
      {
        slide: "Model Summary",
        title: "Core Assumptions Grid",
        strengths: ["Realistic headcount growth and sensible salaries", "LTV/CAC ratio trends are mathematically sound"],
        gaps: ["Assumes 20% flat sales conversion rate from Day 1", "No sensitivity analysis panel included"],
        improvements: "Implement three scenario buttons: Conservative (5% sales CRM conversion), Baseline (10%), and Aggressive (20%)."
      }
    ],
    generalFeedback: "Formula sanity is excellent. Ensure you provide a clear cash runway forecast based on several scenarios."
  },
  {
    id: "doc-3",
    name: "Business_Model_Teaser.docx",
    type: "Business Plan",
    status: "Empty"
  },
  {
    id: "doc-4",
    name: "Competitor_Deep_Research.pdf",
    type: "Market Research",
    status: "Empty"
  }
];

export const INITIAL_BADGES: AchievementBadge[] = [
  { id: "b1", title: "First Diagnosis", description: "Successfully complete the 15-question Startup Assessment and unlock your health metrics.", category: "Assessment", icon: "ClipboardCheck", unlocked: false, points: 150 },
  { id: "b2", title: "Validation Pioneer", description: "Conduct 10 biased-free customer interviews as outlined in Phase 2 roadmap.", category: "Roadmap", icon: "Users", unlocked: true, unlockedAt: "2026-06-15", points: 250 },
  { id: "b3", title: "Deck Approved", description: "Upload your primary slide presentation and secure an AI Investor Assessment score above 75%.", category: "Docs", icon: "Award", unlocked: true, unlockedAt: "2026-06-16", points: 300 },
  { id: "b4", title: "SaaS Executioner", description: "Move 5 high-priority team tasks to completed state.", category: "Tasks", icon: "Briefcase", unlocked: false, points: 200 },
  { id: "b5", title: "Copilot Devoted", description: "Hold 10 continuous advice exchanges with the virtual AI Copilot.", category: "AI", icon: "Sparkles", unlocked: false, points: 100 },
  { id: "b6", title: "Ecosystem Integration", description: "Request feedback from an expert industry mentor and secure your rating.", category: "AI", icon: "FileText", unlocked: true, unlockedAt: "2026-06-14", points: 150 }
];

export const MOCK_MENTORS: Mentor[] = [
  {
    id: "m-1",
    name: "Anand Sen",
    role: "Former VP of Product, Razorpay",
    domain: "Fintech & Payments Scaling",
    description: "Helped scale payment API infrastructure crossing $5B yearly transactions. Specializes in consumer growth hacking, regulatory banking networks, and product optimization loops.",
    experience: "12+ Years",
    rating: 4.9,
    freeDate: "Friday, June 19 (14:00 - 15:30 IST)",
    paidFee: "₹4,500/hr",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    tags: ["Product Roadmap", "Fintech API", "B2B Sales", "Team Structure"]
  },
  {
    id: "m-2",
    name: "Meera Nair",
    role: "General Partner, Elevation India",
    domain: "Venture Capital & Pitch Prep",
    description: "Ex-entrepreneur with successful SaaS acquisition in HR-Tech. Reviews over 500 pitches yearly. Highly recommended for perfecting financial models and bottom-up market narratives.",
    experience: "15 Years",
    rating: 5.0,
    freeDate: "Monday, June 22 (11:00 - 12:00 IST)",
    paidFee: "₹8,000/hr",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    tags: ["Investor Deck", "Financial Assure", "Seed Round", "Enterprise SaaS"]
  },
  {
    id: "m-3",
    name: "Vikram Malhotra",
    role: "Core Platform Architect, Freshworks",
    domain: "SaaS Infrastructure & Node scaling",
    description: "Leading DevOps developer specializing in scaling high-load server databases, Kubernetes configurations, multi-tenant security layers, and lowering AWS overhead costs.",
    experience: "10 Years",
    rating: 4.8,
    freeDate: "Saturday, June 20 (16:00 - 17:30 IST)",
    paidFee: "₹3,500/hr",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    tags: ["Architecture", "Kubernetes", "AWS Billing", "NoSQL Scaling"]
  }
];

export const STARTUP_BLOGS: BlogCardInfo[] = [
  {
    id: "blog-1",
    title: "The Beachhead Market: How to Target a Niche and Win",
    category: "Strategy",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80",
    excerpt: "Why early testing on general users is a setup for failure. Identify your 100 dream users and conquer them.",
    url: "#"
  },
  {
    id: "blog-2",
    title: "Surviving the 2026 Seed Winter: Financial Models that Close Round",
    category: "Fundraising",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&auto=format&fit=crop&q=80",
    excerpt: "Investors value predictable path models. Review bottom-up CAC loops and why MRR consistency dwarfs user totals.",
    url: "#"
  },
  {
    id: "blog-3",
    title: "10 Practical Questions to Ask in Your First 20 Customer Interviews",
    category: "User Research",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&auto=format&fit=crop&q=80",
    excerpt: "How to avoid confirmation bias. Stop showing your product slides and start uncovering customer frustrations.",
    url: "#"
  }
];

export const DISCUSSIONS: CommunityPost[] = [
  {
    id: "p1",
    author: "Arjun Mehta",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    role: "Founder, HealthTrace",
    title: "Should we charge beta customers immediately or offer free access?",
    content: "We have finished our B2B SaaS clinics MVP. Many founders suggest charging from Day 1 to validate purchase desire, but clinics are requesting a 14-day zero commitment trial. What are your feelings?",
    votes: 34,
    replies: 18
  },
  {
    id: "p2",
    author: "Siddharth Verma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    role: "Co-Founder, EduVibe",
    title: "Pitching US VCs from India - remote call tips?",
    content: "We just qualified for elevation accelerator review. Highly interested in tips of structuring the market numbers when conveying slide projections of overseas expansion. Anyone have successful experience?",
    votes: 21,
    replies: 8
  }
];

export const COFOUNDER_MATCHES: MatchingProfile[] = [
  {
    id: "cp-1",
    name: "Nikhil Joshi",
    role: "Full-Stack Engineer & AI Developer",
    stage: "Idea (Looking for active partner)",
    seeking: "Business Growth Co-Founder",
    skills: ["React TS", "FastAPI", "Python LLM Core", "Tailwind styling"],
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "cp-2",
    name: "Rhea Sen",
    role: "B2B Enterprise Lead Specialist",
    stage: "Pre-Revenue Prototype ready",
    seeking: "Technical CTO Co-Founder",
    skills: ["Enterprise CRM", "Slide Deck Narrative", "Cold Outreach", "B2B Sales"],
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
  }
];

export const STARTUP_EVENTS: StartupEvent[] = [
  {
    id: "ev-1",
    title: "Seed Deck Workshop: Design for Conviction",
    date: "June 24, 2026",
    time: "15:00 - 16:30 IST",
    type: "Interactive Workshop",
    speakers: ["Meera Nair (GP Elevation)", "Rahul K. (Ex-Razorpay)"],
    attendees: 142
  },
  {
    id: "ev-2",
    title: "Co-Founder Pitch Speed Dating & Mixer",
    date: "June 28, 2026",
    time: "18:00 - 20:00 IST",
    type: "Networking Mixer",
    speakers: ["Hosted by Indian Startups Network"],
    attendees: 89
  }
];

export const LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Rahul Sharma", startup: "CodeSafe AI", points: 1450, badgeCount: 5, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Neha Roy", startup: "AgriFlow", points: 1200, badgeCount: 4, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Pranav Dixit", startup: "QuickDoc", points: 950, badgeCount: 3, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
];
