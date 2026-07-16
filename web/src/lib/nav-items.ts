import {
  BarChart3,
  BookOpen,
  FileText,
  GitBranch,
  HelpCircle,
  Info,
  KeyRound,
  Rocket,
  Scale,
  Search,
  Settings,
  SquareTerminal,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export type DocNavItem = {
  id: string;
  href: string;
  label: string;
  icon: NavIcon;
};

export type DocNavGroup = {
  title: string;
  items: DocNavItem[];
};

export const DOC_NAV_GROUPS: DocNavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { id: "overview", href: "/dashboard#overview", label: "Overview", icon: BookOpen },
      { id: "installation", href: "/dashboard#installation", label: "Installation", icon: Rocket },
      { id: "environment-setup", href: "/dashboard#environment-setup", label: "Environment Setup", icon: Settings },
      { id: "connect-your-agent", href: "/dashboard#connect-your-agent", label: "Connect Your Agent", icon: SquareTerminal },
    ],
  },
  {
    title: "Using Career-Ops",
    items: [
      { id: "find-roles", href: "/dashboard#find-roles", label: "Find Roles", icon: Search },
      { id: "evaluate-a-job", href: "/dashboard#evaluate-a-job", label: "Evaluate a Job", icon: FileText },
      { id: "compare-jobs", href: "/dashboard#compare-jobs", label: "Compare Jobs", icon: Scale },
      { id: "understand-job-scores", href: "/dashboard#understand-job-scores", label: "Understand Job Scores", icon: BarChart3 },
      { id: "common-workflows", href: "/dashboard#common-workflows", label: "Common Workflows", icon: GitBranch },
    ],
  },
  {
    title: "Configuration",
    items: [
      { id: "api-keys", href: "/dashboard#api-keys", label: "API Keys", icon: KeyRound },
      { id: "cv-md-configuration", href: "/dashboard#cv-md-configuration", label: "CV.md Configuration", icon: FileText },
      { id: "agent-instructions", href: "/dashboard#agent-instructions", label: "Agent Instructions", icon: SquareTerminal },
      { id: "supported-agents", href: "/dashboard#supported-agents", label: "Supported Agents", icon: Settings },
    ],
  },
  {
    title: "Reference",
    items: [
      { id: "troubleshooting", href: "/dashboard#troubleshooting", label: "Troubleshooting", icon: HelpCircle },
      { id: "about-career-ops", href: "/dashboard#about-career-ops", label: "About Career-Ops", icon: Info },
    ],
  },
];

export const WORKSPACE_NAV_ITEMS: DocNavItem[] = [
  { id: "cv-profile", href: "/cv", label: "CV Profile", icon: FileText },
];

export const DOC_SECTION_IDS = DOC_NAV_GROUPS.flatMap((group) => group.items.map((item) => item.id));

export function isWorkspaceActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
