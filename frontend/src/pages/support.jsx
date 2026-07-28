import React, { useState } from 'react';
import {
    PhoneCall,
    Bus,
    MapPin,
    Clock,
    AlertTriangle,
    Search,
    HelpCircle,
    Send,
    MessageSquare,
    ShieldCheck,
    ChevronDown
} from 'lucide-react';

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Quick Support Topics
    const quickCategories = [
        {
            title: "Track & Route Issues",
            desc: "Delay in bus arrival, wrong stop, live tracking not updating",
            icon: <MapPin className="w-6 h-6 text-blue-600" />,
            tag: "Live Route"
        },
        {
            title: "Driver & Attendant",
            desc: "Report behavior, safety concerns, or communication issues",
            icon: <Bus className="w-6 h-6 text-indigo-600" />,
            tag: "Staff"
        },
        {
            title: "Schedule & Timing",
            desc: "Permanent route changes, pick-up time adjustments",
            icon: <Clock className="w-6 h-6 text-amber-600" />,
            tag: "Timings"
        },
        {
            title: "Safety & Emergency",
            desc: "Report accidents, unsafe driving, or immediate hazards",
            icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
            tag: "Urgent"
        }
    ];

    // Frequently Asked Questions
    const faqs = [
        {
            q: "What should I do if the school bus is running late?",
            a: "Check the Live Tracking tab on your dashboard first. If the delay exceeds 15 minutes without an automated SMS update, call our Transport Dispatcher immediately at +1 (800) 555-BUS1."
        },
        {
            q: "How can I request a temporary or permanent bus route change?",
            a: "Submit a request through the form below at least 48 hours in advance for approval by the transport directorate."
        },
        {
            q: "What if my child leaves an item on the school bus?",
            a: "All lost items are handed over to the School Administration Office at the end of the shift. Contact support with your Route Number and Student ID."
        },
        {
            q: "How do I update my primary contact number for SMS alerts?",
            a: "Go to Account Settings > Profile > Guardians, update your mobile number, and verify it via OTP."
        }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
            {/* Hero / Emergency Banner */}
            <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
                <div className="max-w-6xl mx-auto text-center">
                    <span className="bg-amber-500/20 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30">
                        Transport Help Desk
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 text-white">
                        How can we help with your child's transit?
                    </h1>
                    <p className="mt-2 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
                        Get real-time assistance for school bus tracking, route inquiries, safety concerns, and general support.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-6 max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search help articles (e.g., 'bus delay', 'lost item')..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
                {/* Emergency Hotlines Row */}
                <div className="bg-red-500/10 border border-red-200 rounded-2xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm bg-white/90 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-600 text-white rounded-xl shadow-sm">
                            <PhoneCall className="w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-950 text-base sm:text-lg">Urgent / Active Route Hotline</h3>
                            <p className="text-xs sm:text-sm text-red-700">For immediate safety incidents or buses delayed by over 20 minutes.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <a
                            href="tel:18005552871"
                            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl text-center transition shadow-sm"
                        >
                            Call Hotline: +1 (800) 555-BUS1
                        </a>
                    </div>
                </div>

                {/* Quick Categories */}
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    Common Support Areas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {quickCategories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2.5 bg-slate-50 rounded-xl">
                                        {cat.icon}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                        {cat.tag}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-900 text-base">{cat.title}</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cat.desc}</p>
                            </div>
                            <span className="mt-4 text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1">
                                Explore topics &rarr;
                            </span>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout: Ticket Form + FAQs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Submit Support Ticket Form */}
                    <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Submit a Support Ticket</h2>
                                <p className="text-xs text-slate-500">Our transport team typically responds within 2 hours during active shifts.</p>
                            </div>
                        </div>

                        {submitted && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
                                ✅ Ticket submitted successfully! A dispatcher will reach out shorty.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. John Doe"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. STU-9402"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Route No.</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Route 12-A"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Category</label>
                                    <select className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                                        <option>Bus Delay / Timing Issue</option>
                                        <option>Driver / Attendant Behavior</option>
                                        <option>Change Pickup/Drop Stop</option>
                                        <option>Lost Belonging</option>
                                        <option>App / Live Tracking Problem</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="Provide details like date, time, bus stop location, and description of the issue..."
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                                Submit Ticket
                            </button>
                        </form>
                    </div>

                    {/* FAQs Accordion */}
                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Frequently Asked</h2>
                                <p className="text-xs text-slate-500">Quick answers to common questions</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border border-slate-200 rounded-xl overflow-hidden transition"
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                        className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-900 transition"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                                    </button>
                                    {activeFaq === index && (
                                        <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Additional Info Box */}
                        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                            <p className="font-bold text-slate-800 mb-1">Need to speak to the Transport Office?</p>
                            <p>Operating Hours: Mon - Fri (6:00 AM - 6:00 PM)</p>
                            <p className="mt-1">Email: <span className="font-semibold text-amber-600">transport@school.edu</span></p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}