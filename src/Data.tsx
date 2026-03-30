import { FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaMailBulk, FaLinkedin, FaMedium, FaGithub } from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiNestjs,
  SiMysql,
  SiCplusplus,
  SiGithub,
  SiFirebase,
  SiFigma,
  SiNpm,
  SiPostgresql,
  SiPostman,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";
import { TbBrandReactNative, TbBrandNextjs } from "react-icons/tb";
import { DiSwift } from "react-icons/di";
import { BiLogoVisualStudio } from "react-icons/bi";

export const SKILLS = [
  {
    id: 0,
    skills: "HTML",
    icon: FaHtml5,
    color: "text-orange-500",

  },
  {
    id: 1,
    skills: "CSS",
    icon: FaCss3Alt,
    color: "text-blue-500",
  },
  {
    id: 2,
    skills: "JavaScript",
    icon: SiJavascript,
    color: "text-yellow-400",
  },
  {
    id: 3,
    skills: "TypeScript",
    icon: SiTypescript,
    color: "text-blue-600",
  },
  {
    id: 4,
    skills: "React",
    icon: FaReact,
    color: "text-cyan-400",
  },
  {
    id: 5,
    skills: "React Native",
    icon: TbBrandReactNative,
    color: "text-cyan-400",
  },
  {
    id: 6,
    skills: "Git",
    icon: FaGitAlt,
    color: "text-orange-600",
  },
  {
    id: 7,
    skills: "Swift",
    icon: DiSwift,
    color: "text-orange-500",
  },
  {
    id: 8,
    skills: "Next.js",
    icon: TbBrandNextjs,
    color: "text-black",
  },
  {
    id: 9,
    skills: "NestJS",
    icon: SiNestjs,
    color: "text-red-600",
  },
  {
    id: 10,
    skills: "SQL",
    icon: SiMysql,
    color: "text-blue-500",
  },
  {
    id: 11,
    skills: "C++",
    icon: SiCplusplus,
    color: "text-blue-700",
  },
];

export const TOOLS = [
  {
    id: 0,
    tools: "Antigravity",
    icon: BiLogoVisualStudio,
    color: "text-blue-400",
  },
  {
    id: 1,
    tools: "Android Studio",
    icon: SiAndroidstudio,
    color: "text-green-500",
  },
  {
    id: 2,
    tools: "Xcode",
    icon: SiXcode,
    color: "text-blue-500",
  },
  {
    id: 3,
    tools: "Postman",
    icon: SiPostman,
    color: "text-orange-500",
  },
  {
    id: 4,
    tools: "pgAdmin",
    icon: SiPostgresql,
    color: "text-blue-600",
  },
  {
    id: 5,
    tools: "GitHub",
    icon: SiGithub,
    color: "text-black",
  },
  {
    id: 6,
    tools: "Firebase",
    icon: SiFirebase,
    color: "text-yellow-500",
  },
  {
    id: 7,
    tools: "Cursor AI",
    icon: SiAndroidstudio, // Using Android Studio icon as placeholder for Cursor AI
    color: "text-purple-500",
  },
  {
    id: 8,
    tools: "Antigravity",
    icon: SiNpm, // Using npm icon as placeholder for Antigravity
    color: "text-indigo-500",
  },
  {
    id: 9,
    tools: "npm",
    icon: SiNpm,
    color: "text-red-600",
  },
];

export const PROJECTS = [
  {
    id: 0,
    title: "Aayush",
    github: "",
    description:
      "Aayush is a patient-centric healthcare app that enables users to book, reschedule, and manage doctor appointments. It features medicine reminders, medical report uploads, navigation assistance, and secure ABHA integration with NHA certification. The app also integrates with a smartwatch, allowing users to view upcoming appointments and access appointment QR codes directly on the watch. Aayush is developed for both Android and iOS platforms.",
    image: "/Image/image4.jpeg",
    SkillsTools: [
      "React Native",
      "Firebase",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Android Studio",
      "Xcode",
      "Postman",
    ],
  },
  {
    id: 1,
    title: "Offline e₹ App",
    github: "",
    description:
      "Developed an offline e₹ payment application enabling secure digital transactions without internet, improving accessibility and usability in low-connectivity environments.",
    image: "/Image/offline.jpeg",
    SkillsTools: [
      "React Native",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Android Studio",
      "Xcode",
    ],
  },
  {
    id: 3,
    title: "Finguard AI",
    github: "",
    description:
      "Finguard AI is a comprehensive financial management application designed to help users track expenses, manage budgets, and gain insights into their spending habits. The app features secure login, transaction tracking, budget planning, and visual analytics to promote financial wellness.",
    image: "/Image/finguard.png",
    SkillsTools: [
      "Next JS",
      "Nest JS",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Postman",
      "PostgreSQL",
    ],
  },
  {
    id: 4,
    title: "Note App",
    github: "https://github.com/Elakkiya-S-28/NoteApps",
    description:
      "A daily notes application for creating, organizing, and searching notes.  Users can personalize the app with theme switching for a better experience.",
    image: "/Image/image1.jpeg",
    SkillsTools: [
      "React Native",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Android Studio",
      "Xcode",
    ],
  },
  {
    id: 5,
    title: "Lucky Pick",
    github: "https://github.com/Elakkiya-S-28/LuckyPick",
    description:
      "Lucky Pick is a simple number-guessing game where users select a number and compete against an opponent trying to guess it. The app focuses on clean UI, smooth game flow, and interactive gameplay.",
    image: "/Image/image2.jpeg",
    SkillsTools: [
      "React Native",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Android Studio",
      "Xcode",
    ],
  },
  {
    id: 6,
    title: "Tic Tac Toe",
    github: "https://github.com/Elakkiya-S-28/Tic-Tac-Toe",
    description:
      "A classic Tic Tac Toe game where the user plays against the computer, focusing on simple gameplay and intuitive UI.",
    image: "/Image/image3.jpeg",
    SkillsTools: [
      "React Native",
      "Figma",
      "GitHub",
      "npm",
      "Antigravity",
      "Android Studio",
      "Xcode",
    ],
  },
];


export const EXPERIENCE = [
  {
    company: "Plenome Technologies Pvt Ltd",
    role: "Frontend Developer - React Native",
    duration: "Aug 2023 - Present",
    description:
      "Built scalable UI components, improved performance, and collaborated with design teams.",
  },
  {
    company: "Plenome Technologies Pvt Ltd",
    role: "Frontend Developer - React Native (Internship)",
    duration: "Feb 2023 – July 2023",
    description:
      "Worked on enterprise-level applications with focus on accessibility and performance.",
  },
  {
    company: "Compunet Connections",
    role: "Frontend Developer - React  (Internship)",
    duration: "June 2021 – Nov 2021",
    description:
      "Automated CI/CD pipelines and improved infrastructure reliability.",
  },
];


export const contactLinks = [
  {
    icon: FaMailBulk,
    label: "Email",
    href: "mailto:selvarajanelakkiya@gmail.com",
    text: "selvarajanelakkiya@gmail.com",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/elakkiya-selvarajan-384b1a1aa/",
    // text: "linkedin.com/in/elakkiya-selvarajan",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Elakkiya-S-28",
    // text: "github.com/Elakkiya-S-28",
    color: "from-gray-700 to-gray-800",
  },
  {
    icon: FaMedium,
    label: "Medium",
    href: "https://medium.com/@selvarajanelakkiya",
    // text: "medium.com/@selvarajanelakkiya",
    color: "from-gray-400 to-gray-500",
  },
];