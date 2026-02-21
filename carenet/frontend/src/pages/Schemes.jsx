import { useState, useMemo } from "react";
import { Search, BookOpen, ExternalLink, Filter, Sparkles } from "lucide-react";

const ALL_SCHEMES = [
  {
    name: "Ayushman Bharat PM-JAY",
    benefit: "Health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    eligibility: "Families identified in bottom 40% as per SECC database; no age or family-size cap.",
    applicationLink: "https://www.pmjay.gov.in/",
    tags: ["Financial Aid", "Hospitalization"],
  },
  {
    name: "Nikshay Poshan Yojana (₹500/month)",
    benefit: "₹500 per month nutritional support throughout TB treatment duration.",
    eligibility: "All notified TB patients registered on the Ni-kshay portal.",
    applicationLink: "https://tbcindia.gov.in/",
    tags: ["TB", "Nutrition"],
  },
  {
    name: "Rashtriya Vayoshri Yojana",
    benefit: "Free assisted living devices — hearing aids, spectacles, dentures, wheelchairs, etc.",
    eligibility: "Senior citizens aged 60+ from BPL families.",
    applicationLink: "https://www.elderly.gov.in/",
    tags: ["Senior Care", "Devices"],
  },
  {
    name: "Janani Suraksha Yojana",
    benefit: "Cash assistance for institutional delivery and post-natal care.",
    eligibility: "Pregnant women from BPL / SC / ST families across all states.",
    applicationLink: "https://nhm.gov.in/",
    tags: ["Maternal", "Delivery"],
  },
  {
    name: "CGHS Scheme",
    benefit: "Comprehensive medical care through Central Government Health Scheme facilities.",
    eligibility: "Central government employees, pensioners and their dependents.",
    applicationLink: "https://cghs.gov.in/",
    tags: ["Government", "Comprehensive"],
  },
  {
    name: "State Health Card",
    benefit: "State-specific health insurance and subsidized care at empanelled hospitals.",
    eligibility: "Varies by state; typically targets low-income and rural families.",
    applicationLink: "https://www.india.gov.in/",
    tags: ["State", "Insurance"],
  },
];

const TAG_COLORS = [
  "bg-cyan-500/15 text-cyan-400",
  "bg-purple-500/15 text-purple-400",
  "bg-green-500/15 text-green-400",
  "bg-orange-500/15 text-orange-400",
  "bg-pink-500/15 text-pink-400",
  "bg-indigo-500/15 text-indigo-400",
];

export default function Schemes() {
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const allTags = useMemo(() => {
    const set = new Set();
    ALL_SCHEMES.forEach((s) => s.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return ALL_SCHEMES.filter((s) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(searchLower) ||
        s.benefit.toLowerCase().includes(searchLower);
      const matchTag = !tagFilter || s.tags.includes(tagFilter);
      return matchSearch && matchTag;
    });
  }, [search, tagFilter]);

  return (
    <div className="p-8 animate-fadeIn">
      <div className="flex items-center justify-between mb-8 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center border border-green-500/20">
            <BookOpen className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Government Schemes</h1>
            <p className="text-slate-400 mt-0.5">Financial assistance programs for patients</p>
          </div>
        </div>
        <span className="bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm px-3 py-1.5 rounded-xl">
          {filtered.length} scheme{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search & Tags */}
      <div className="glass-card p-4 mb-6 animate-fadeInUp delay-100">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 bg-slate-800/50 border border-slate-700/50 text-white rounded-xl px-4 py-2.5 placeholder-slate-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-4 h-4 text-slate-500" />
            <button
              onClick={() => setTagFilter("")}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!tagFilter ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "bg-slate-700/50 text-slate-400 border border-transparent hover:bg-slate-600/50"
                }`}
            >
              All
            </button>
            {allTags.map((tag, i) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tagFilter === tag ? "" : tag)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${tagFilter === tag
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "bg-slate-700/50 text-slate-400 border border-transparent hover:bg-slate-600/50"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((scheme, i) => (
          <div
            key={scheme.name}
            className="glass-card p-5 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-0.5 animate-fadeInUp group"
            style={{ animationDelay: `${0.15 + i * 0.06}s` }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-white font-bold text-lg">{scheme.name}</h3>
              <Sparkles className="w-4 h-4 text-yellow-400/50 shrink-0 mt-1" />
            </div>
            <p className="text-slate-300 text-sm mb-3 leading-relaxed">{scheme.benefit}</p>
            <p className="text-slate-500 text-xs mb-4">
              <span className="font-semibold text-slate-400">Eligibility:</span> {scheme.eligibility}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-wrap gap-1.5">
                {scheme.tags.map((tag, ti) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${TAG_COLORS[ti % TAG_COLORS.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={scheme.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors text-sm font-medium"
              >
                Apply
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card p-16 text-center text-slate-500 mt-6">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No schemes match your search</p>
        </div>
      )}
    </div>
  );
}
