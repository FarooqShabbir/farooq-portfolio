// Single source of truth for site copy, taken from the resume.
// Contact details (email, phone, social handles) are intentionally not stored here.

export const SITE_URL = "https://farooqshabbir.online";

export const profile = {
  name: "Farooq Shabbir",
  role: "Full Stack DevOps Engineer",
  roleTag: "AI First",
  location: "Lahore, Pakistan",
  availability: "Open to full-time roles and freelance projects",
  headline: "I ship the platform, the pipeline and the AI feature.",
  intro:
    "Full Stack DevOps Engineer working AI-first. I build backends in Python and FastAPI, frontends in Next.js, and the AWS and Azure infrastructure, CI/CD and release tooling that get them to production safely.",
  description:
    "Farooq Shabbir is a Full Stack DevOps Engineer (AI First) building FastAPI and Next.js products, AWS and Azure infrastructure, CI/CD pipelines, signed release systems and production AI features.",
};

export type Experience = {
  role: string;
  company: string;
  place: string;
  period: string;
  current?: boolean;
  summary: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Full Stack DevOps Engineer (AI First)",
    company: "Freelance",
    place: "Remote · UK-based client",
    period: "Apr 2026 — Present",
    current: true,
    summary:
      "Backend, frontend, Windows desktop agent and release infrastructure for an AI-powered job-application automation platform, built with an AI-first workflow (Claude Code) and strict review, testing and verification on every change.",
    points: [
      "Built and maintain a Windows desktop agent that fills applications across Greenhouse, Lever, Ashby and LinkedIn with Playwright, with a review step before submission and sensitive data redacted from logs.",
      "Designed a secure self-updater: Ed25519-signed manifests, SHA-256 integrity checks, automatic rollback on a failed build and single-instance protection, validated end-to-end on the packaged build.",
      "Resolved Microsoft Defender quarantining the agent by changing how it is packaged and launched at startup; own the code-signing strategy (OV certificate, cloud signing).",
      "Sped up the API and database (FastAPI, PostgreSQL/Supabase) with targeted queries and zero-downtime indexes; added guaranteed agent-to-server result delivery and remote device revocation.",
      "Shipped AI features: Claude-generated interview questions, an LLM-as-judge scoring answers on a five-dimension rubric, a streaming voice interview (STT → LLM → TTS over WebSockets) and generated cover letters.",
      "Cut voice-response delay with a parallel save path, a Redis pre-check, speculative follow-up audio and a pre-warmed speaker.",
      "Architecting the AWS deployment: GitHub Actions CI/CD, a separate staging environment for client acceptance, secrets in AWS Secrets Manager, HTTPS, uptime monitoring and recovery runbooks.",
      "Configured transactional email (Resend with Supabase Auth) on an isolated subdomain to protect sender reputation, and work directly with the founder on requirements, cost and releases.",
    ],
    stack: ["Python", "FastAPI", "Next.js", "PostgreSQL", "Supabase", "Redis", "Playwright", "Claude API", "AWS", "GitHub Actions"],
  },
  {
    role: "DevOps Engineer Intern",
    company: "NetSol Technologies",
    place: "Lahore, Pakistan",
    period: "Jul 2026 — Aug 2026",
    summary:
      "CI/CD, containerisation and AWS networking work, documented so another engineer can rebuild each environment from scratch.",
    points: [
      "Built CI/CD pipelines in GitHub Actions and Azure DevOps (YAML, self-hosted agents) triggered by webhooks and path-filtered commits, from checkout through build, sanity checks, deploy and post-deploy verification.",
      "Replaced manual steps with one-command Bash automation for Docker build-and-push, service deployment and environment setup and teardown.",
      "Packaged apps as multi-stage Docker images with Docker Compose and nginx, and ran them on Ubuntu with systemd.",
      "Designed VPCs with public and private subnets, NAT and Internet Gateways, Route 53 delegation, ACM certificates and ALB path-based routing with health checks and HTTP→HTTPS redirects.",
      "Provisioned and scaled EC2 with custom AMIs, Launch Templates and Auto Scaling Groups; monitored with CloudWatch alarms, SNS alerts and health endpoints.",
      "Applied least-privilege IAM roles per instance, kept secrets in AWS Secrets Manager and Azure DevOps, and replaced SSH with SSM Session Manager.",
    ],
    stack: ["GitHub Actions", "Azure DevOps", "Docker", "nginx", "AWS VPC", "EC2", "ALB", "Route 53", "CloudWatch", "Bash"],
  },
  {
    role: "DevOps Intern (CMIT)",
    company: "Argon Teq Limited",
    place: "Lahore, Pakistan",
    period: "Jan 2026 — Jun 2026",
    summary:
      "First production cloud work: deploying and monitoring a client recruitment application under senior engineers.",
    points: [
      "Deployed a Node.js and Next.js recruitment application for a client on AWS (EC2, VPC, Docker).",
      "Supported GitHub Actions pipeline configuration and built and tested Docker images for microservices.",
      "Monitored performance with AWS CloudWatch and Azure Monitor and flagged optimisation opportunities.",
    ],
    stack: ["AWS EC2", "VPC", "Docker", "GitHub Actions", "CloudWatch", "Azure Monitor"],
  },
];

export type CaseStudy = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  bullets: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: "release",
    kicker: "Release engineering",
    title: "A self-updating desktop agent that can't be tampered with",
    body:
      "A Windows agent that installs its own updates has to prove every byte is genuine and recover when a release goes wrong.",
    bullets: [
      "Ed25519-signed update manifests and SHA-256 checks on every artifact",
      "Automatic rollback when a new build fails to start",
      "Packaging and startup reworked so Microsoft Defender stops quarantining it",
      "OV code signing via cloud signing, PyInstaller and Inno Setup",
    ],
  },
  {
    id: "voice",
    kicker: "Applied AI",
    title: "A real-time voice interviewer, tuned for latency",
    body:
      "Speech-to-text, an LLM and text-to-speech streamed over WebSockets, with an LLM-as-judge scoring each answer on a five-dimension rubric.",
    bullets: [
      "Parallel save path so persistence never blocks the reply",
      "Redis pre-check before expensive work",
      "Speculative follow-up audio and a pre-warmed speaker",
      "Claude API for questions, scoring and cover letters",
    ],
  },
  {
    id: "infra",
    kicker: "Cloud infrastructure",
    title: "AWS networks built to be rebuilt",
    body:
      "VPCs, load balancing and auto scaling defined end to end and written up as runbooks, so any engineer can reproduce an environment.",
    bullets: [
      "Public and private subnets, NAT and Internet Gateways",
      "ALB path routing, health checks, ACM TLS and HTTP→HTTPS",
      "Auto Scaling Groups from custom AMIs and Launch Templates",
      "IAM roles per instance, SSM instead of SSH",
    ],
  },
  {
    id: "pipeline",
    kicker: "CI/CD",
    title: "Pipelines that fail loudly, not silently",
    body:
      "GitHub Actions and Azure DevOps pipelines that take a commit all the way to a verified deployment, and stop the moment something is wrong.",
    bullets: [
      "Webhook and path-filtered triggers on self-hosted agents",
      "Build, sanity checks, deploy and post-deploy verification",
      "Polling that fails the run on error or timeout",
      "Separate staging for client acceptance before production",
    ],
  },
];

export type Service = { title: string; body: string; deliverables: string[] };

export const services: Service[] = [
  {
    title: "CI/CD pipelines",
    body: "Commit-to-production pipelines on GitHub Actions, Azure DevOps, GitLab or Jenkins, with staging, checks and post-deploy verification.",
    deliverables: ["Pipeline as code", "Staging environment", "Runbook"],
  },
  {
    title: "Cloud infrastructure on AWS and Azure",
    body: "Secure networks, load balancing, auto scaling, TLS and DNS, with least-privilege access and secrets kept out of the repo.",
    deliverables: ["VPC and IAM design", "HTTPS and DNS", "Cost review"],
  },
  {
    title: "Containerise and deploy",
    body: "Multi-stage Docker images, Compose, nginx and systemd on Linux, moving an app from a laptop to a reliable server.",
    deliverables: ["Dockerfiles", "One-command deploy", "Health checks"],
  },
  {
    title: "AI features in production",
    body: "LLM features built on the Claude API: generation, LLM-as-judge evaluation and streaming voice, designed for latency and cost.",
    deliverables: ["Prompt and rubric design", "Streaming backend", "Evaluation"],
  },
  {
    title: "Desktop release and code signing",
    body: "Packaged Windows apps with signed, verifiable auto-updates and rollback, and fixes for antivirus false positives.",
    deliverables: ["Installer", "Signed updates", "Rollback"],
  },
  {
    title: "Monitoring and runbooks",
    body: "CloudWatch and Azure Monitor alerting, health endpoints, and the recovery and backup runbooks your team will actually use.",
    deliverables: ["Alarms and alerts", "Recovery runbooks", "Backup plan"],
  },
];

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Cloud", items: ["AWS", "Azure", "GCP"] },
  { label: "CI/CD", items: ["GitHub Actions", "Azure DevOps", "AWS CodePipeline", "CodeBuild", "CodeDeploy", "Jenkins", "GitLab"] },
  { label: "Languages & frameworks", items: ["Python", "FastAPI", "SQLAlchemy", "Next.js", "React", "TypeScript"] },
  { label: "Data", items: ["PostgreSQL", "Supabase", "Redis"] },
  { label: "Containers & OS", items: ["Docker", "Docker Compose", "nginx", "Linux", "Windows"] },
  { label: "Automation", items: ["Playwright", "Patchright", "Chrome DevTools Protocol", "Bash", "PowerShell"] },
  { label: "Release", items: ["PyInstaller", "Inno Setup", "Code signing", "Ed25519 updates", "SHA-256 integrity"] },
  { label: "Security", items: ["AWS IAM", "Secrets Manager", "Security Groups", "Azure RBAC", "Defender compliance"] },
  { label: "Observability", items: ["CloudWatch", "Azure Monitor", "Log Analytics", "Application Insights"] },
];

export const education = [
  {
    degree: "MS Computer Science",
    school: "National University of Computing and Emerging Sciences (FAST)",
    period: "2025 — 2027",
    note: "In progress · CGPA 3.32",
  },
  {
    degree: "BS Computer Science",
    school: "University of Central Punjab",
    period: "2020 — 2024",
    note: "CGPA 3.34",
  },
];

export const certifications = [
  "Oracle Multi Cloud Professional",
  "Huawei HCCDP Solution Architect",
  "DevOps and AI on AWS (Coursera)",
];

export const award = {
  title: "Winner, Code Rush 2024",
  body: "University of Central Punjab coding competition, ahead of 100+ participants with a 95% completion rate.",
};

export const stats = [
  { value: "3", label: "Clouds: AWS, Azure, GCP" },
  { value: "4", label: "Job platforms automated by the agent" },
  { value: "5", label: "Dimensions in the LLM-as-judge rubric" },
  { value: "0", label: "Downtime for production index changes" },
];
