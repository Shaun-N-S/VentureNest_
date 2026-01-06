import type React from "react"
import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Users, Handshake, Rocket, Shield, ArrowRight, Twitter, Linkedin, Mail, Menu, X } from "lucide-react"
import { useState } from "react"
import Snowfall from 'react-snowfall'

type Feature = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    description: string
}

type Testimonial = {
    name: string
    role: string
    quote: string
    initials: string
}

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 60, damping: 16, mass: 0.6 },
    },
}

const listVariants: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

const features: Feature[] = [
    {
        icon: Users,
        title: "Networking",
        description: "Meet founders, mentors, and investors in a curated, high-signal network.",
    },
    {
        icon: Handshake,
        title: "Funding Opportunities",
        description: "Discover active investors aligned with your stage and sector focus.",
    },
    {
        icon: Rocket,
        title: "Growth Support",
        description: "Access playbooks, office hours, and partners to accelerate traction.",
    },
    {
        icon: Shield,
        title: "Secure Platform",
        description: "Your data is protected with enterprise-grade security and controls.",
    },
]

const testimonials: Testimonial[] = [
    {
        name: "Ava Thompson",
        role: "Founder, FinTech",
        quote: "VentureNest helped us meet the right investors at the right time. We closed our round faster than expected.",
        initials: "AT",
    },
    {
        name: "Michael Chen",
        role: "Investor, Seed",
        quote: "Great deal flow and thoughtful founder profiles. It made diligence more efficient and collaborative.",
        initials: "MC",
    },
    {
        name: "Sara Lopez",
        role: "Founder, SaaS",
        quote: "The community and growth support were invaluable. We found mentors who truly moved the needle.",
        initials: "SL",
    },
]

const steps = [
    {
        step: "01",
        title: "Sign up",
        description: "Create your profile in minutes. Tell us about your startup or investment focus.",
    },
    {
        step: "02",
        title: "Connect",
        description: "Match with aligned partners. Start conversations and book intros seamlessly.",
    },
    {
        step: "03",
        title: "Grow",
        description: "Leverage resources, insights, and capital to scale your venture.",
    },
]

const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/#features", label: "Features" },
    { href: "/#profiles", label: "Explore Profiles" },
    { href: "/#reviews", label: "Reviews" },

]

const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return

    const yOffset = -80 // sticky navbar height
    const y =
        el.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset

    window.scrollTo({ top: y, behavior: "smooth" })
    // closeEverything()
}


export default function LandingPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null)

    const closeEverything = () => {
        setAuthMode(null)
        setIsMobileMenuOpen(false)
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Snowfall color="#82C3D9" />

                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 font-semibold text-lg" onClick={closeEverything}>
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    VN
                                </div>
                                <span className="hidden sm:inline">VentureNest</span>
                            </Link>

                            {/* Desktop Links */}
                            <div className="hidden md:flex items-center gap-8">
                                {navLinks.map((link) =>
                                    link.href.startsWith("/#") ? (
                                        <button
                                            key={link.href}
                                            onClick={() => scrollToSection(link.href.replace("/#", ""))}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </button>
                                    ) : (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                            onClick={closeEverything}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                )}
                            </div>


                            {/* Desktop Auth */}
                            <div className="relative hidden md:flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setAuthMode(authMode === "login" ? null : "login")}
                                >
                                    Login
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => setAuthMode(authMode === "signup" ? null : "signup")}
                                >
                                    Sign Up
                                </Button>

                                {/* Dropdown */}
                                {authMode && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 top-full mt-3 w-64 rounded-xl border bg-white shadow-2xl overflow-hidden z-[9999]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="p-3 space-y-4">
                                            <div>
                                                <Link
                                                    to={`/${authMode}`}
                                                    className="block px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                                                    onClick={closeEverything}
                                                >
                                                    {authMode === "login" ? "Continue as Founder" : "Continue as Founder"}
                                                </Link>
                                            </div>

                                            <div>
                                                <Link
                                                    to={`/investor/${authMode}`}
                                                    className="block px-4 py-2.5 text-sm rounded-lg hover:bg-gray-100 transition-colors"
                                                    onClick={closeEverything}
                                                >
                                                    {authMode === "login" ? "Continue as Investor" : "Continue as Investor"}
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                    setAuthMode(null)
                                }}
                                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden border-t border-border pt-4 pb-6 space-y-4"
                            >
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        to={link.href}
                                        className="block py-2 text-sm text-muted-foreground hover:text-foreground"
                                        onClick={closeEverything}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                <div className="pt-4 space-y-3">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start"
                                        onClick={() => setAuthMode(authMode === "login" ? null : "login")}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className="w-full"
                                        onClick={() => setAuthMode(authMode === "signup" ? null : "signup")}
                                    >
                                        Sign Up
                                    </Button>

                                    {authMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 space-y-3 bg-muted/50 rounded-xl p-4"
                                        >
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-2">As Founder</p>
                                                <Link
                                                    to={`/${authMode}`}
                                                    className="block px-4 py-2.5 text-sm bg-white rounded-lg hover:bg-gray-50 transition-colors"
                                                    onClick={closeEverything}
                                                >
                                                    {authMode === "login" ? "Founder Login" : "Founder Sign Up"}
                                                </Link>
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground mb-2">As Investor</p>
                                                <Link
                                                    to={`/investor/${authMode}`}
                                                    className="block px-4 py-2.5 text-sm bg-white rounded-lg hover:bg-gray-50 transition-colors"
                                                    onClick={closeEverything}
                                                >
                                                    {authMode === "login" ? "Investor Login" : "Investor Sign Up"}
                                                </Link>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </nav>

                {/* Hero */}
                <section className="relative py-20 md:py-28">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={containerVariants}
                            className="mx-auto max-w-3xl text-center"
                        >
                            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance">
                                VentureNest: Where entrepreneurs meet smart capital
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground text-pretty">
                                A modern platform connecting ambitious founders with investors, mentors, and resources to accelerate growth.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="rounded-xl">
                                    <Link to="/signup">
                                        Start Your Journey
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="rounded-xl">
                                    <Link to="/investor/login">Join as Investor</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="border-t py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={listVariants}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {features.map((feature, i) => (
                                <motion.div key={i} variants={itemVariants}>
                                    <Card className="h-full hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="p-3 w-fit rounded-lg bg-muted">
                                                <feature.icon className="h-6 w-6" />
                                            </div>
                                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="profiles" className="border-t py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="text-center max-w-2xl mx-auto mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-semibold">How it works</h2>
                            <p className="mt-4 text-muted-foreground">A simple flow designed to create meaningful connections.</p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={listVariants}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {steps.map((step) => (
                                <motion.div key={step.step} variants={itemVariants}>
                                    <Card className="h-full">
                                        <CardContent className="pt-8">
                                            <div className="text-4xl font-bold text-primary/20 mb-4">{step.step}</div>
                                            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                            <p className="text-muted-foreground">{step.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="reviews" className="border-t bg-muted/30 py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={containerVariants}
                            className="text-center max-w-2xl mx-auto mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-semibold">Loved by founders and investors</h2>
                            <p className="mt-4 text-muted-foreground">Real stories from people building the future.</p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={listVariants}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {testimonials.map((t, i) => (
                                <motion.div key={i} variants={itemVariants}>
                                    <Card className="h-full">
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <Avatar>
                                                    <AvatarFallback>{t.initials}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{t.name}</div>
                                                    <div className="text-sm text-muted-foreground">{t.role}</div>
                                                </div>
                                            </div>
                                            <p className="italic text-muted-foreground">"{t.quote}"</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t py-12">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
                        <div>© {new Date().getFullYear()} VentureNest. All rights reserved.</div>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-foreground transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-foreground transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="mailto:hello@venturenest.com" className="hover:text-foreground transition-colors">
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </footer>
        </main>
    )
}