import {
  BarChart3,
  Bot,
  Brain,
  Building2,
  CalendarClock,
  CircleHelp,
  ClipboardList,
  Database,
  FileCog,
  FileText,
  Gauge,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Rocket,
  ScanSearch,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  UserSearch,
  type LucideIcon,
} from "lucide-react";

export interface LienNav {
  libelle: string;
  href: string;
  icone: LucideIcon;
}

export interface GroupeNav {
  titre: string;
  icone: LucideIcon;
  liens: LienNav[];
}

export const LIEN_DASHBOARD: LienNav = {
  libelle: "Dashboard",
  href: "/",
  icone: LayoutDashboard,
};

export const GROUPES_NAV: GroupeNav[] = [
  {
    titre: "RH",
    icone: Users,
    liens: [
      { libelle: "AI HR Command Center", href: "/rh/command-center", icone: Gauge },
      { libelle: "Collaborateurs", href: "/rh/collaborateurs", icone: Users },
      { libelle: "Absences & Congés", href: "/rh/absences", icone: CalendarClock },
      { libelle: "Événements RH", href: "/rh/evenements", icone: ShieldCheck },
      { libelle: "AI HR Insights", href: "/rh/insights", icone: BarChart3 },
    ],
  },
  {
    titre: "Recrutement",
    icone: UserSearch,
    liens: [
      { libelle: "AI Recruitment Manager", href: "/recrutement/pipeline", icone: Rocket },
      { libelle: "Candidatures", href: "/recrutement/candidatures", icone: ClipboardList },
      { libelle: "AI Candidate Screening", href: "/recrutement/screening", icone: ScanSearch },
      { libelle: "Entretiens", href: "/recrutement/entretiens", icone: CalendarClock },
    ],
  },
  {
    titre: "Documents",
    icone: FileText,
    liens: [{ libelle: "AI HR Document Generator", href: "/documents", icone: FileText }],
  },
  {
    titre: "Onboarding",
    icone: GraduationCap,
    liens: [{ libelle: "AI Onboarding Manager", href: "/onboarding", icone: GraduationCap }],
  },
  {
    titre: "Assistants IA",
    icone: Brain,
    liens: [
      { libelle: "AI Employee Assistant", href: "/assistants/employe", icone: Bot },
      { libelle: "AI School Service Agent", href: "/assistants/service-ecole", icone: MessageSquare },
    ],
  },
  {
    titre: "Demandes & Réclamations",
    icone: Inbox,
    liens: [
      { libelle: "Toutes les demandes", href: "/demandes", icone: Inbox },
      { libelle: "Réclamations", href: "/demandes/reclamations", icone: ClipboardList },
      { libelle: "Emails entrants", href: "/demandes/emails", icone: Mail },
    ],
  },
  {
    titre: "Administration",
    icone: Building2,
    liens: [
      { libelle: "Utilisateurs", href: "/administration/utilisateurs", icone: Users },
      { libelle: "Paramètres", href: "/administration/parametres", icone: Settings },
    ],
  },
  {
    titre: "CONFIGURATION IA",
    icone: Brain,
    liens: [
      { libelle: "Agents IA", href: "/configuration-ia/agents", icone: Bot },
      { libelle: "Base de connaissances", href: "/configuration-ia/base-connaissances", icone: Database },
      { libelle: "Modèles de documents", href: "/configuration-ia/modeles-documents", icone: FileCog },
      { libelle: "FAQ", href: "/configuration-ia/faq", icone: CircleHelp },
      { libelle: "Paramètres", href: "/configuration-ia/parametres", icone: SlidersHorizontal },
    ],
  },
];

export const TOUS_LES_LIENS: LienNav[] = [LIEN_DASHBOARD, ...GROUPES_NAV.flatMap((g) => g.liens)];
