'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/shadcn-button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	CodeIcon,
	GlobeIcon,
	LayersIcon,
	UserPlusIcon,
	Users,
	Star,
	FileText,
	Shield,
	RotateCcw,
	Handshake,
	HelpCircle,
	BarChart,
	PlugIcon,
	BotIcon,
	MessageSquareText,
	Workflow,
	Zap,
	Brain,
	Image as ImageIcon,
	Newspaper,
} from 'lucide-react';
import StrixmindLogo from '@/components/ui/StrixmindLogo';
import ThemeToggle from '@/components/Theme/ThemeToggle';
import { useTheme } from '@/components/Theme/ThemeProvider';
import { CONTENT_DEFAULTS } from '@/lib/cms/registry';

type NavLink = { label: string; href: string };
type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

const DEFAULTS = CONTENT_DEFAULTS['global.nav'] as {
	links: NavLink[];
	signInLabel: string;
	ctaLabel: string;
	ctaHref: string;
};

interface HeaderProps {
	links?: NavLink[];
	signInLabel?: string;
	ctaLabel?: string;
	ctaHref?: string;
}

export function SiteHeader({
	links = DEFAULTS.links,
	signInLabel = DEFAULTS.signInLabel,
	ctaLabel = DEFAULTS.ctaLabel,
	ctaHref = DEFAULTS.ctaHref,
}: HeaderProps) {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);
	const { theme } = useTheme();

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent transition-all duration-300', {
				'bg-[var(--header-bg-scrolled)] border-[var(--border)] backdrop-blur-xl shadow-[0_4px_30px_var(--glass-bg)]': scrolled,
				'bg-[var(--header-bg)] backdrop-blur-md': !scrolled,
			})}
		>
			<nav className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-6 sm:px-8">
				<div className="flex items-center gap-6">
					{/* Logo */}
					<Link href="/" className="flex items-center no-underline shrink-0">
						<StrixmindLogo size={30} variant="full" theme={theme} />
					</Link>


					{/* Desktop nav */}
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-medium">
									Product
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-[var(--nav-dropdown-bg,var(--surface))] p-1 pr-1.5">
									<ul className="bg-[var(--nav-dropdown-bg,var(--surface))] grid w-[540px] grid-cols-2 gap-2 rounded-xl border border-[var(--border)] p-2 shadow-lg">
										{productLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
									<div className="p-2">
										<p className="text-[var(--text-muted)] text-sm">
											Interested?{' '}
											<a href="#contact" className="text-[var(--accent-deep)] font-medium hover:underline">
												Schedule a demo
											</a>
										</p>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-medium">
									Company
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-[var(--nav-dropdown-bg,var(--surface))] p-1 pr-1.5 pb-1.5">
									<div className="grid w-[480px] grid-cols-2 gap-2">
										<ul className="bg-[var(--nav-dropdown-bg,var(--surface))] space-y-1 rounded-xl border border-[var(--border)] p-2 shadow-lg">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-1 p-3">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<NavigationMenuLink
														href={item.href}
														className="flex p-2 hover:bg-[var(--glass-bg)] flex-row rounded-lg items-center gap-x-2 transition-colors"
													>
														<item.icon className="text-[var(--accent-deep)] size-4" />
														<span className="font-medium text-sm text-[var(--text)]">{item.title}</span>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] text-sm font-medium">
									Work
								</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-[var(--nav-dropdown-bg,var(--surface))] p-1 pr-1.5">
									<ul className="bg-[var(--nav-dropdown-bg,var(--surface))] grid w-[320px] gap-2 rounded-xl border border-[var(--border)] p-2 shadow-lg">
										{workLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				{/* Desktop CTAs */}
				<div className="hidden items-center gap-4 md:flex">
					<ThemeToggle />
					<Button asChild>
						<Link
							href="/book-meeting"
							className="no-underline bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] shadow-[0_8px_24px_var(--shadow-strong)] hover:shadow-[0_10px_32px_var(--shadow-strong)] text-white font-semibold"
						>
							Book a Meeting
						</Link>
					</Button>
				</div>

				{/* Mobile hamburger */}
				<div className="flex items-center gap-2 md:hidden">
					<ThemeToggle />
					<Button
						size="icon"
						variant="outline"
						onClick={() => setOpen(!open)}
						className="border-[var(--border)] text-[var(--text)]"
						aria-expanded={open}
						aria-controls="mobile-menu"
						aria-label="Toggle menu"
					>
						<MenuToggleIcon open={open} className="size-5" duration={300} />
					</Button>
				</div>
			</nav>

			{/* Mobile menu */}
			<MobileMenu open={open} className="flex flex-col justify-between gap-2 overflow-y-auto">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-2">
						<span className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] px-2 pt-2">Product</span>
						{productLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<span className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] px-2 pt-2">Work</span>
						{workLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						<span className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] px-2 pt-2">Company</span>
						{companyLinks.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
						{companyLinks2.map((link) => (
							<ListItem key={link.title} {...link} />
						))}
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-2 pt-2 border-t border-[var(--border)] mt-4">
					<Button className="w-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]" asChild>
						<Link href="/book-meeting" className="no-underline text-white font-semibold">Book a Meeting</Link>
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-[var(--header-bg-scrolled)] backdrop-blur-xl',
				'fixed top-[72px] right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-[var(--border)] md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
	return (
		<NavigationMenuLink
			className={cn(
				'w-full flex flex-row gap-x-2 hover:bg-[var(--glass-bg)] hover:text-[var(--text)] focus:bg-[var(--glass-bg)] focus:text-[var(--text)] rounded-lg p-2 transition-colors',
				className,
			)}
			{...props}
			asChild
		>
			<a href={href}>
				<div className="bg-[var(--glass-bg)] flex aspect-square size-11 items-center justify-center rounded-lg border border-[var(--border)] shadow-sm flex-shrink-0">
					<Icon className="text-[var(--accent-deep)] size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-semibold text-sm text-[var(--text)]">{title}</span>
					{description && <span className="text-[var(--text-dim)] text-xs">{description}</span>}
				</div>
			</a>
		</NavigationMenuLink>
	);
}

// ─── Link data ────────────────────────────────────────────────

const productLinks: LinkItem[] = [
	{
		title: 'AI Workflow Engine',
		href: '/#workflow',
		description: 'Automate complex processes end-to-end',
		icon: Workflow,
	},
	{
		title: 'Multi-Agent AI',
		href: '/#services',
		description: 'Six specialised agents, priority task queue',
		icon: Brain,
	},
	{
		title: 'WhatsApp CRM',
		href: '/#services',
		description: 'Session-aware messaging and pipelines',
		icon: MessageSquareText,
	},
	{
		title: 'Analytics',
		href: '/#why',
		description: 'Track and forecast revenue in real-time',
		icon: BarChart,
	},
	{
		title: 'Integrations',
		href: '/#services',
		description: 'Connect your existing apps and services',
		icon: PlugIcon,
	},
	{
		title: 'API Access',
		href: '/#contact',
		description: 'Build custom integrations with our API',
		icon: CodeIcon,
	},
];

const workLinks: LinkItem[] = [
	{
		title: 'Projects',
		href: '/work/projects',
		description: 'Client case studies — the problem, the build, the outcome',
		icon: LayersIcon,
	},
	{
		title: 'Blog',
		href: '/work/blog',
		description: 'Notes on building, shipping, and growing StrixMind',
		icon: Newspaper,
	},
	{
		title: 'Gallery',
		href: '/work/gallery',
		description: 'Snapshots from behind the scenes and finished work',
		icon: ImageIcon,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: 'About Us',
		href: '/about',
		description: 'Learn more about our story and mission',
		icon: Users,
	},
	{
		title: 'Customer Stories',
		href: '/#testimonials',
		description: "See how we've helped clients succeed",
		icon: Star,
	},
	{
		title: 'Partnerships',
		href: '/#contact',
		description: 'Collaborate with us for mutual growth',
		icon: Handshake,
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Terms of Service',
		href: '#',
		icon: FileText,
	},
	{
		title: 'Privacy Policy',
		href: '#',
		icon: Shield,
	},
	{
		title: 'Refund Policy',
		href: '#',
		icon: RotateCcw,
	},
	{
		title: 'Help Center',
		href: '#',
		icon: HelpCircle,
	},
];

// ─── useScroll hook ───────────────────────────────────────────

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}

export default SiteHeader;
