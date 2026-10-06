// Skema isi website. File-file di content/ memakai tipe ini lewat komentar JSDoc,
// jadi VS Code memberi autocomplete dan menandai field yang salah ketik.
// Cek seluruhnya dari terminal: npm run typecheck

export type Color = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
export type Tone = Color | 'ink';
/** case:<slug proyek> | xp:<id role> | go:#selector | file:/files/x.pdf | url:https://… */
export type ProofRef = `case:${string}` | `xp:${string}` | `go:${string}` | `file:${string}` | `url:${string}`;
/** 'YYYY-MM' */
export type YearMonth = `${number}-${string}`;

export interface Headline { lead: string; punch: string; color?: Color; focus?: 'marketing' | 'tech' }
export interface HeroSticker { text: string; color: Tone }
export interface Stat { value: number; prefix?: string; suffix: string; decimals: number; label: string; note: string; proof?: ProofRef }
export interface Social { label: string; handle: string; href: string }
export interface ContactIntent { label: string; subject: string; body: string }
export interface Profile {
  name: string; firstName: string; lastName: string; initials: string;
  roles: string[]; headlines: Headline[]; headlineInterval?: number;
  cvTitle?: string; tagline: string; stickers: HeroSticker[];
  location: string; availability: string;
  photo?: string; photoCutout?: boolean; avatar?: string; cv?: string;
  bio: string[]; stats: Stat[];
  contacts: { email: string; whatsapp?: string; linkedin?: string; instagram?: string; github?: string };
  socials: Social[]; contactIntents?: ContactIntent[];
  marqueeLabel?: string; marquee: string[];
  taglines?: { marketing?: string; tech?: string };
  cvVersions?: Record<'marketing' | 'tech', { label: string; title: string; summary: string }>;
  languages?: string[];
}

export interface ExperienceItem {
  id?: string; company: string; short?: string; role: string; type: 'work' | 'org';
  period: string; start?: YearMonth; end?: YearMonth | null; location: string;
  logo?: string; points: string[]; tags?: string[]; link?: string;
  photo?: string; photoCaption?: string;
}
export interface ExperienceGroup { id: string; title: string; subtitle: string; color: Color; items: ExperienceItem[]; photo?: string; photoCaption?: string }

export interface Chart {
  title: string; data: [string, number][];
  prefix?: string; suffix?: string; decimals?: number; format?: 'compact'; delta?: boolean; note?: string;
}
export interface CaseStudy {
  role: string; summary: string; challenge?: string; todo?: string;
  contributions?: string[]; results?: { value: string; label: string; todo?: boolean }[];
  charts?: Chart[]; gallery?: { src: string; caption: string }[]; links?: { label: string; href: string }[];
}
export interface Project {
  slug: string; title: string; category: string; year: string; result: string; description: string;
  cover?: string; coverStyle?: 'image' | 'browser' | 'code'; accent?: Tone; size?: 'wide' | 'normal';
  placeholder?: boolean; stack?: string[]; url?: string; file?: string; link?: string; caseStudy?: CaseStudy;
}
export interface MoreWork { label: string; canva?: string; linkedin?: string; github?: string }

export interface Tool { icon: string; name: string; note: string; kind?: 'code' }
export interface SkillSticker { label: string; cv?: 'tech' | 'soft'; proof?: ProofRef[] }
export interface Skills { tools: Tool[]; stickers: (SkillSticker | string)[] }

export interface Education { school: string; degree: string; period: string; note?: string; noteFile?: string; file?: string; logo?: string; inCV?: boolean }
export interface Certificate { title: string; issuer: string; year: string; file?: string; link?: string }
export interface Achievement { badge: string; title: string; issuer: string; year: string; color?: Color; proof?: ProofRef; todo?: boolean }
export interface PlaybookStep {
  visual: 'research' | 'hook' | 'edit' | 'measure'; title: string; lead: string; text: string;
  tools?: string[]; hookText?: string; proof?: ProofRef; proofLabel?: string;
}
export interface Playbook { steps: PlaybookStep[] }

export interface Settings {
  opening: 'edit' | 'zoom' | 'paper' | 'slot' | 'none';
  openingPicker: boolean; showTodos: boolean; siteUrl?: string; vercelAnalytics?: boolean;
  openingWord?: string; openingCaptions?: string[];
  features: Partial<Record<'cursor' | 'sound' | 'confetti' | 'velocityMarquee' | 'wordmark' | 'clock' | 'scrollBadge' | 'headlineRotator' | 'timeline' | 'composer' | 'commandPalette' | 'cvSheet', boolean>>;
  city: string; timezone: string; timezoneLabel: string;
}
