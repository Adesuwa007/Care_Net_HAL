import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

const QA_DATABASE = [
    // ─── Navigation Questions ───
    {
        keywords: ["add", "new patient", "register patient", "add patient"],
        question: "How do I add a new patient?",
        answer:
            'Click "Add Patient" in the left sidebar. Fill in the patient\'s name, age, disease, hospital, and financial score. You can also upload an Aadhaar card photo to auto-fill the details instantly.',
    },
    {
        keywords: ["see all patients", "all patients", "patient list", "browse patients", "where patients"],
        question: "Where can I see all patients?",
        answer:
            'Click "Patients" in the sidebar. You\'ll see a full list with filters for risk level, disease, and hospital. Patients are sorted by highest dropout risk first.',
    },
    {
        keywords: ["high risk", "find high risk", "critical patients", "risky patients"],
        question: "How do I find high risk patients quickly?",
        answer:
            'Two ways — the Dashboard shows the top high-risk patients directly on the right side. Or go to Patients page and filter by "High" in the risk level dropdown.',
    },
    {
        keywords: ["transfer", "transfer records", "move patient", "change hospital", "hospital transfer"],
        question: "How do I transfer a patient's records to another hospital?",
        answer:
            'Click "Transfer Records" in the sidebar. Search for the patient on the left panel, select them, then fill in the new hospital name, transfer reason, and receiving doctor. Click Transfer — the full medical history moves with them.',
    },
    {
        keywords: ["graphs", "charts", "analytics", "visualization", "data"],
        question: "Where are the graphs and charts?",
        answer:
            'Click "Analytics" in the sidebar. You\'ll find 6 live charts — risk distribution donut chart, weekly trend lines, disease breakdown, hospital load, scheme enrollment, and treatment stage distribution.',
    },
    {
        keywords: ["download", "medical record", "pdf", "patient record", "export"],
        question: "How do I download a patient's medical record?",
        answer:
            'Open any patient\'s profile by clicking "View Profile" from the Patients page. At the top you\'ll see a "Download Patient Record" button — clicking it generates a full PDF with risk assessment, appointments, and medical history.',
    },
    {
        keywords: ["prescription", "create prescription", "medicine", "prescribe"],
        question: "How do I create a prescription for a patient?",
        answer:
            'Open the patient\'s profile and click "Create Prescription". Fill in the doctor\'s name, diagnosis, and add medications with dosage and frequency. A live preview shows on the right side. Click download to get the PDF.',
    },
    {
        keywords: ["nearby", "medicine store", "cheap medicine", "jan aushadhi", "pharmacy", "medical store"],
        question: "Where can I find nearby cheap medicine stores?",
        answer:
            'Click "Nearby Services" in the sidebar. Allow location access when the browser asks. You\'ll see Jan Aushadhi stores near you with distances and a "Get Directions" button for each.',
    },
    {
        keywords: ["ambulance", "emergency", "call ambulance", "108", "112"],
        question: "How do I call an ambulance from the app?",
        answer:
            'Go to "Nearby Services" in the sidebar and click the "Emergency Ambulance" tab. You\'ll see large call buttons for 108 (Medical Emergency) and 112 (National Emergency) that dial directly from your device.',
    },
    {
        keywords: ["scheme", "government scheme", "health scheme", "ayushman", "yojana"],
        question: "Where can I see government health schemes?",
        answer:
            'Click "Health Schemes" in the sidebar. You\'ll find 8 major schemes including Ayushman Bharat, Nikshay Poshan Yojana, and JSY — each with eligibility details and a direct link to the official government portal.',
    },
    {
        keywords: ["enroll", "enroll scheme", "enroll patient", "scheme enrollment"],
        question: "How do I enroll a patient in a scheme?",
        answer:
            'Open the patient\'s profile. The right column shows "Recommended Schemes" based on their disease and financial score. Click the "Enroll" button next to any scheme — the system updates their risk score automatically.',
    },
    {
        keywords: ["logs", "login history", "logout history", "audit", "activity log", "system log"],
        question: "Where can I see login and logout history?",
        answer:
            'Click "System Logs" in the sidebar. You\'ll see a full audit trail with timestamps, usernames, activity types, and success/failure status. You can filter by date, user, or activity type.',
    },

    // ─── Feature Explanation Questions ───
    {
        keywords: ["what is dropout", "dropout risk", "dropout meaning", "what does dropout mean"],
        question: "What is dropout risk?",
        answer:
            "Dropout risk is the AI's prediction of how likely a patient is to stop their treatment midway. It's calculated using missed appointments, days since last visit, financial score, follow-up calls received, and hospital delays. High means above 70% probability, Medium is 40–70%, Low is below 40%.",
    },
    {
        keywords: ["how ai predict", "how predict", "ml model", "machine learning", "random forest", "how does ai"],
        question: "How does the AI predict dropout risk?",
        answer:
            "CARE-NET uses a Random Forest machine learning model trained on patient behavior patterns. It analyzes 7 factors — missed appointments, days since last visit, financial score, treatment stage, follow-up calls, hospital delay days, and scheme enrollment — and outputs a risk probability with specific reasons.",
    },
    {
        keywords: ["aadhaar", "aadhaar scan", "scan feature", "identity", "id card"],
        question: "What is the Aadhaar scan feature?",
        answer:
            "On the Add Patient form, you can upload a photo of a patient's Aadhaar card. The AI reads the card and automatically fills in the patient's name, age, gender, and last 4 Aadhaar digits. This saves time and reduces manual entry errors.",
    },
    {
        keywords: ["last 4 digit", "why only 4", "aadhaar privacy", "why not full aadhaar"],
        question: "Why are only the last 4 digits of Aadhaar stored?",
        answer:
            "To protect patient privacy. Storing the full 12-digit Aadhaar number requires special legal compliance. The last 4 digits are enough to uniquely link a patient's identity across hospitals without storing sensitive data.",
    },
    {
        keywords: ["jan aushadhi meaning", "what is jan aushadhi", "janaushadhi", "generic medicine"],
        question: "What is Jan Aushadhi?",
        answer:
            "Jan Aushadhi is the Pradhan Mantri Bharatiya Janaushadhi Pariyojana — a Government of India program that sells quality generic medicines at up to 90% lower prices than branded drugs. CARE-NET helps patients find the nearest Jan Aushadhi store so financial constraints don't cause treatment dropout.",
    },
    {
        keywords: ["transfer happen", "what happens transfer", "transfer process", "medical history transfer"],
        question: "What happens when a patient is transferred to a new hospital?",
        answer:
            "CARE-NET saves the complete medical history — diagnosis, treatment, doctor notes — from the previous hospital. The new hospital can see the full journey instantly. The AI also re-runs the risk assessment after transfer since hospital change is itself a dropout risk factor.",
    },
    {
        keywords: ["admin", "doctor", "login", "admin vs doctor", "difference admin", "username", "password", "credentials"],
        question: "What is the difference between the admin and doctor login?",
        answer:
            "Admin (username: admin, password: carenet2026) has access to all patients across all hospitals and can view system logs and clear data. Doctor (username: doctor, password: doctor123) is linked to AIIMS Delhi. Both roles can create patients, run assessments, and generate prescriptions.",
    },
    {
        keywords: ["scheme reduce", "how scheme help", "enrollment reduce risk", "scheme dropout"],
        question: "How does scheme enrollment reduce dropout risk?",
        answer:
            "When a patient is enrolled in a financial scheme like Ayushman Bharat, their financial barrier is removed. The ML model treats scheme_enrolled as 1 instead of 0, which directly reduces the predicted dropout probability in the next risk assessment.",
    },

    // ─── Project & Hackathon Questions ───
    {
        keywords: ["problem", "what problem", "why carenet", "purpose", "what does carenet solve"],
        question: "What problem does CARE-NET solve?",
        answer:
            "In India, nearly 50% of TB patients and many chronic disease patients drop out of treatment midway — not because of medical failure but because of system failures like fragmented records, no financial aid awareness, missed follow-ups, and poor hospital communication. CARE-NET detects and fixes these system failures before dropout happens.",
    },
    {
        keywords: ["tech stack", "technology", "built with", "framework", "what language"],
        question: "What is the tech stack used?",
        answer:
            "Frontend: React + Vite + TailwindCSS + Recharts. Backend: Node.js + Express + MongoDB. AI/ML: Python + Flask + Scikit-learn Random Forest model. Additional: jsPDF for document generation, Overpass API for nearby store locator.",
    },
    {
        keywords: ["how many patient", "tracking", "demo patient", "sample patient"],
        question: "How many patients is CARE-NET currently tracking?",
        answer:
            "The demo has 6 seeded patients including 2 high-risk cases — Mohammed Iqbal (Diabetes, 87% dropout risk) and Lakshmi Devi (Hypertension, 79% dropout risk). The platform can scale to any number of patients.",
    },
    {
        keywords: ["other disease", "only tb", "can it work", "scale disease", "more disease"],
        question: "Can CARE-NET work for diseases other than TB?",
        answer:
            "Yes. CARE-NET currently supports TB, Diabetes, Hypertension, Maternal Care, Cancer, and more. The dropout risk model and scheme recommendation engine work for any chronic disease. New diseases can be added by updating the disease dropdown and scheme logic.",
    },
    {
        keywords: ["scale", "real hospital", "production", "deploy", "how scale"],
        question: "How does CARE-NET scale to real hospitals?",
        answer:
            "The three-service architecture — React frontend, Node.js backend, Python ML service — can each be scaled independently. MongoDB Atlas scales automatically. The ML model can be retrained on real hospital data. A mobile app version using the same backend API is a natural Phase 2.",
    },
    {
        keywords: ["which scheme", "how many scheme", "list scheme", "supported scheme"],
        question: "What government schemes does CARE-NET support?",
        answer:
            "Eight schemes currently — Ayushman Bharat PM-JAY (₹5L coverage), Nikshay Poshan Yojana (TB ₹500/month), Janani Suraksha Yojana (maternal cash support), Rashtriya Vayoshri Yojana (senior citizens), NP-NCD (diabetes/hypertension), CGHS (government employees), PM National Dialysis Programme, and National AIDS Control Programme.",
    },

    // ─── Troubleshooting Questions ───
    {
        keywords: ["unknown risk", "risk unknown", "assessment unknown", "ml not working", "risk not working"],
        question: "The risk assessment shows Unknown — what do I do?",
        answer:
            'The ML service on port 5001 may not be running. Open a terminal, go to the ml-service folder, activate the virtual environment with source venv/bin/activate, and run python app.py. Then click "Re-Assess Risk" on the patient profile.',
    },
    {
        keywords: ["location", "can't see location", "location denied", "gps not working", "nearby not working"],
        question: "I can't see my location on the Nearby Services page.",
        answer:
            "Click \"Allow\" when the browser asks for location permission. If you already denied it, go to your browser's address bar, click the lock icon, and reset location permissions. Then refresh the page.",
    },
];

const QUICK_ACTIONS = [
    "How do I add a patient?",
    "What is dropout risk?",
    "Show high risk patients",
    "Find nearby pharmacy",
];

function findBestAnswer(userInput) {
    const input = userInput.toLowerCase().trim();

    // Try exact question match first
    for (const qa of QA_DATABASE) {
        if (input === qa.question.toLowerCase()) {
            return qa.answer;
        }
    }

    // Score each QA by keyword matches
    let bestMatch = null;
    let bestScore = 0;

    for (const qa of QA_DATABASE) {
        let score = 0;
        const inputWords = input.split(/\s+/);

        for (const keyword of qa.keywords) {
            if (input.includes(keyword.toLowerCase())) {
                // Longer keyword matches = higher score
                score += keyword.length;
            }
        }

        // Also check if any input words appear in the question
        for (const word of inputWords) {
            if (word.length > 2 && qa.question.toLowerCase().includes(word)) {
                score += 1;
            }
        }

        if (score > bestScore) {
            bestScore = score;
            bestMatch = qa;
        }
    }

    if (bestMatch && bestScore >= 3) {
        return bestMatch.answer;
    }

    return "I'm not sure about that. Here are some things I can help with:\n\n• How to add, view, or transfer patients\n• Understanding dropout risk and AI predictions\n• Finding nearby pharmacies or calling ambulances\n• Government health schemes and enrollment\n• Creating prescriptions and downloading records\n• Analytics, system logs, and app navigation\n\nTry asking something like \"How do I add a patient?\" or \"What is dropout risk?\"";
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = (userMessage) => {
        if (!userMessage.trim()) return;

        const userMsg = { role: "user", content: userMessage };
        const botReply = findBestAnswer(userMessage);
        const botMsg = { role: "assistant", content: botReply };

        setMessages((prev) => [...prev, userMsg, botMsg]);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-[380px] h-[520px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
                    style={{ animation: "fadeInUp 0.3s ease-out" }}
                >
                    {/* Header */}
                    <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center gap-3 shrink-0">
                        <div className="bg-cyan-500 rounded-full p-2">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white text-sm font-semibold">CARE-NET Assistant</p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <span className="text-green-400 text-xs">Online</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length === 0 && (
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-slate-800 text-white rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[80%]">
                                        Hi! 👋 I'm your CARE-NET assistant. Ask me anything about the platform — navigation, features, or troubleshooting!
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 ml-8">
                                    {QUICK_ACTIONS.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-full px-3 py-1.5 border border-slate-600 transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) =>
                            msg.role === "user" ? (
                                <div key={i} className="flex justify-end">
                                    <div className="bg-cyan-500 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[80%]">
                                        {msg.content}
                                    </div>
                                </div>
                            ) : (
                                <div key={i} className="flex items-start gap-2">
                                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="w-3 h-3 text-white" />
                                    </div>
                                    <div className="bg-slate-800 text-white rounded-2xl rounded-bl-sm px-4 py-2 text-sm max-w-[80%] whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-700 p-3 flex gap-2 shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything about CARE-NET..."
                            className="bg-slate-800 text-white rounded-xl px-4 py-2 flex-1 text-sm placeholder-slate-500 border border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                        <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim()}
                            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 rounded-xl p-2 transition-colors"
                        >
                            <Send className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg"
                style={{
                    background: isOpen ? "#334155" : "#06b6d4",
                }}
                title="CARE-NET Assistant"
            >
                {!isOpen && (
                    <span className="absolute -inset-1 bg-cyan-500/30 rounded-full animate-ping" />
                )}
                {isOpen ? (
                    <X className="w-6 h-6 text-white relative z-10" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white relative z-10" />
                )}
            </button>
        </>
    );
}
