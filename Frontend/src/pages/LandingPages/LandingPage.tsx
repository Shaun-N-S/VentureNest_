import type * as React from "react"
import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Users, Handshake, Rocket, Shield, ArrowRight, Twitter, Linkedin, Mail } from "lucide-react"
import founderImg from "../../assets/founder-portrait.jpg"
import investorImg from "../../assets/investor-portrait.jpg"
import saasFounderImg from "../../assets/saas-founder-portrait.jpg"


type Feature = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
    title: string
    description: string
}

type Testimonial = {
    name: string
    role: string
    quote: string
    imageSrc: string
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
        quote:
            "VentureNest helped us meet the right investors at the right time. We closed our round faster than expected.",
        imageSrc: founderImg,
        initials: "AT",
    },
    {
        name: "Michael Chen",
        role: "Investor, Seed",
        quote: "Great deal flow and thoughtful founder profiles. It made diligence more efficient and collaborative.",
        imageSrc: investorImg,
        initials: "MC",
    },
    {
        name: "Sara Lopez",
        role: "Founder, SaaS",
        quote: "The community and growth support were invaluable. We found mentors who truly moved the needle.",
        imageSrc: saasFounderImg,
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



export default function LandingPage() {
    return (
        <main className="bg-background text-foreground">
            {/* Hero */}
            <section className="relative">
                <div className="container mx-auto px-4 py-20 md:py-28">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={containerVariants}
                        className="mx-auto max-w-3xl text-center"
                    >
                        <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                            VentureNest: Where entrepreneurs meet smart capital
                        </h1>
                        <p className="mt-4 text-pretty text-base text-muted-foreground md:mt-6 md:text-lg">
                            A modern platform connecting ambitious founders with investors, mentors, and resources to accelerate
                            growth.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button
                                asChild
                                className="h-11 rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <Link to="/login">
                                    Start Your Entrepreneur Journey
                                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                className="h-11 rounded-lg border border-input bg-secondary text-secondary-foreground shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <Link to="/investors/login">
                                    Join as an Investor
                                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="border-t">
                <div className="container mx-auto px-4 py-14 md:py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={listVariants}
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {features.map((f, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <Card className="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <CardHeader className="flex flex-row items-center gap-3">
                                        <div className="rounded-md bg-muted p-2 ring-1 ring-border">
                                            <f.icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                                        </div>
                                        <CardTitle className="text-lg">{f.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{f.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-t">
                <div className="container mx-auto px-4 py-14 md:py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={containerVariants}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">How it works</h2>
                        <p className="mt-3 text-muted-foreground">A simple flow designed to create meaningful connections.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={listVariants}
                        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        {steps.map((s, i) => (
                            <motion.div key={s.step} variants={itemVariants}>
                                <Card className="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
                                                <span className="text-sm font-medium">{s.step}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold">{s.title}</h3>
                                                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="border-t">
                <div className="container mx-auto px-4 py-14 md:py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={containerVariants}
                        className="mx-auto max-w-2xl text-center"
                    >
                        <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">Loved by founders and investors</h2>
                        <p className="mt-3 text-muted-foreground">Real stories from people building the future.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={listVariants}
                        className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                        {testimonials.map((t, idx) => (
                            <motion.div key={idx} variants={itemVariants}>
                                <Card className="h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={t.imageSrc || "/placeholder.svg"} alt={`${t.name} portrait`} />
                                                <AvatarFallback>{t.initials}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-sm font-medium">{t.name}</div>
                                                <div className="text-xs text-muted-foreground">{t.role}</div>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-sm leading-relaxed text-foreground">“{t.quote}”</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="border-t"
            >
                <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row">
                    <div>© {new Date().getFullYear()} VentureNest</div>
                    <div className="flex items-center gap-4">
                        <Link
                            to="#"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                            aria-label="Visit us on Twitter"
                        >
                            <Twitter className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Twitter</span>
                        </Link>
                        <Link
                            to="#"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                            aria-label="Visit us on LinkedIn"
                        >
                            <Linkedin className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">LinkedIn</span>
                        </Link>
                        <Link
                            to="#"
                            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                            aria-label="Contact via email"
                        >
                            <Mail className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Email</span>
                        </Link>
                    </div>
                </div>
            </motion.footer>
        </main>
    )
}
