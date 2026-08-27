export type SpecializationItem = {
  id: string;
  label: string;
  slug: string;
  status: "active" | "coming_soon";
  description: string;
  whoFor: string;
  duration: string;
};

export type TeamNode = {
  id: string;
  label: string;
  description: string;
  icon: string;
  specializations: SpecializationItem[];
};

export const CYBERSECURITY_TREE: TeamNode[] = [
  { id: "red-team", label: "Red Team — Offensive", description: "Finding and exploiting weaknesses before real attackers do.", icon: "⚔️", specializations: [
    { id: "penetration-testing", label: "Penetration Testing", slug: "penetration-testing", status: "active", description: "Test systems, networks, and apps for exploitable vulnerabilities under a defined scope.", whoFor: "People who like breaking things methodically and writing reports.", duration: "10–15 months" },
    { id: "red-team-ops", label: "Red Team Operations", slug: "red-team-ops", status: "coming_soon", description: "Full adversary simulation campaigns mimicking real attacker TTPs.", whoFor: "Experienced pentesters ready to go beyond scoped assessments.", duration: "Advanced" },
    { id: "bug-bounty", label: "Bug Bounty Hunting", slug: "bug-bounty", status: "active", description: "Find vulnerabilities in real production systems for monetary rewards.", whoFor: "Self-directed learners who want flexible, outcome-based work.", duration: "Ongoing" },
    { id: "vuln-research", label: "Vulnerability Research & Exploit Dev", slug: "vuln-research", status: "active", description: "Discover new vulnerabilities and write working exploits.", whoFor: "People who like low-level systems, C/C++, and original research.", duration: "Advanced" },
    { id: "web-app-pentesting", label: "Web App Pentesting", slug: "web-app-pentesting", status: "active", description: "Specialize in finding and exploiting web application vulnerabilities.", whoFor: "People focused on web technologies and browser-based attack surfaces.", duration: "6–10 months" },
    { id: "mobile-app-pentesting", label: "Mobile App Security Testing", slug: "mobile-app-pentesting", status: "active", description: "Assess iOS and Android applications for security weaknesses.", whoFor: "People interested in mobile platforms and reverse engineering apps.", duration: "6–8 months" },
    { id: "network-infra-pentest", label: "Network & Infrastructure Pentesting", slug: "network-infra-pentest", status: "active", description: "Test internal and external network infrastructure for vulnerabilities.", whoFor: "People who like networking, protocols, and Active Directory attacks.", duration: "8–12 months" },
    { id: "social-engineering", label: "Social Engineering", slug: "social-engineering", status: "active", description: "Human-focused attacks — phishing campaigns, pretexting, physical security.", whoFor: "People with strong communication skills and interest in human psychology.", duration: "4–6 months" },
    { id: "hardware-iot", label: "Hardware / Embedded / IoT Hacking", slug: "hardware-iot", status: "coming_soon", description: "Attack physical devices, embedded systems, and IoT products.", whoFor: "People with electronics/hardware interest alongside software skills.", duration: "Advanced" },
    { id: "blockchain-security", label: "Blockchain / Smart Contract / Web3 Security", slug: "blockchain-security", status: "coming_soon", description: "Audit smart contracts and find vulnerabilities in Web3 protocols.", whoFor: "People with programming background interested in blockchain technology.", duration: "6–9 months" },
  ] },
  { id: "blue-team", label: "Blue Team — Defensive", description: "Detecting, responding to, and preventing attacks.", icon: "🛡️", specializations: [
    { id: "soc-analyst", label: "SOC Analyst", slug: "soc-analyst", status: "coming_soon", description: "Monitor alerts, triage incidents, and escalate threats in a Security Operations Center.", whoFor: "People who like investigation, pattern recognition, and working under pressure.", duration: "4–6 months" },
    { id: "incident-response", label: "Incident Response", slug: "incident-response", status: "coming_soon", description: "Contain and remediate active security breaches.", whoFor: "People who stay calm under pressure and like solving live problems fast.", duration: "6–9 months" },
    { id: "threat-hunting", label: "Threat Hunting", slug: "threat-hunting", status: "coming_soon", description: "Proactively search for threats that evaded automated detection.", whoFor: "Experienced defenders with strong analytical and hypothesis-driven thinking.", duration: "Advanced" },
    { id: "digital-forensics", label: "Digital Forensics", slug: "digital-forensics", status: "coming_soon", description: "Investigate security incidents by recovering and analyzing digital evidence.", whoFor: "Detail-oriented people who like piecing together what happened after an attack.", duration: "6–9 months" },
    { id: "malware-analysis", label: "Malware Analysis & Reverse Engineering", slug: "malware-analysis", status: "coming_soon", description: "Dissect malicious software to understand how it works and what it does.", whoFor: "People who like low-level code, assembly, and understanding attacker tools deeply.", duration: "Advanced" },
    { id: "detection-engineering", label: "Detection Engineering", slug: "detection-engineering", status: "coming_soon", description: "Build and tune detection rules that power SOC alerts and SIEM platforms.", whoFor: "People who like coding + security + data — writing rules that catch real attacks.", duration: "6–9 months" },
    { id: "security-engineering", label: "Security Engineering", slug: "security-engineering", status: "coming_soon", description: "Build security tooling, platforms, and infrastructure for an organization.", whoFor: "Software engineers pivoting into security who like building internal tools.", duration: "8–12 months" },
    { id: "iam", label: "Identity & Access Management (IAM)", slug: "iam", status: "coming_soon", description: "Manage who has access to what — authentication, authorization, and identity systems.", whoFor: "People interested in enterprise systems, compliance, and access control design.", duration: "4–6 months" },
  ] },
  { id: "purple-team", label: "Purple Team — Hybrid", description: "Combining offensive and defensive skills, bridging both sides.", icon: "🔮", specializations: [
    { id: "appsec", label: "Application Security (AppSec)", slug: "appsec", status: "coming_soon", description: "Secure software during development — code review, SAST/DAST, secure SDLC.", whoFor: "Developers who want to specialize in security or security people who can code.", duration: "6–9 months" },
    { id: "cloud-security", label: "Cloud Security", slug: "cloud-security", status: "coming_soon", description: "Secure cloud infrastructure across AWS, Azure, and GCP.", whoFor: "People interested in cloud platforms, infrastructure, and automation.", duration: "6–9 months" },
    { id: "devsecops", label: "DevSecOps", slug: "devsecops", status: "coming_soon", description: "Integrate security into CI/CD pipelines and development workflows.", whoFor: "DevOps engineers or developers who want to shift security left in the SDLC.", duration: "6–9 months" },
    { id: "security-architecture", label: "Security Architecture", slug: "security-architecture", status: "coming_soon", description: "Design secure systems and networks from the ground up.", whoFor: "Experienced security professionals moving into strategic/design roles.", duration: "Advanced" },
    { id: "threat-intelligence", label: "Threat Intelligence", slug: "threat-intelligence", status: "coming_soon", description: "Track attacker groups, TTPs, and feed intelligence back into defenses.", whoFor: "People who like research, geopolitics, and connecting dots across data sources.", duration: "6–9 months" },
    { id: "ai-ml-security", label: "AI / ML Security", slug: "ai-ml-security", status: "coming_soon", description: "Secure AI systems and find vulnerabilities in machine learning models.", whoFor: "People with ML background who want to apply security thinking to AI systems.", duration: "Emerging field" },
    { id: "grc", label: "GRC (Governance, Risk & Compliance)", slug: "grc", status: "coming_soon", description: "Frameworks, audits, risk assessments, and compliance programs.", whoFor: "Less hands-on-technical people who are strong in communication and process.", duration: "4–6 months" },
    { id: "osint", label: "Open Source Intelligence (OSINT)", slug: "osint", status: "coming_soon", description: "Gather and analyze publicly available information for security investigations.", whoFor: "People who like research, investigation, and piecing together information.", duration: "3–5 months" },
  ] },
];