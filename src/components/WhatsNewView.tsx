"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedText } from "./AnimatedText";
import { GitBranch, Loader2, Tag, Calendar, AlertCircle } from "lucide-react";


interface GitHubRelease {
  id: number;
  name: string;
  tag_name: string;
  published_at: string;
  body: string;
  html_url: string;
}

export function WhatsNewView() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch releases from GitHub API
    fetch("https://api.github.com/repos/ArinPattnaik/PurePlate/releases")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch updates");
        return res.json();
      })
      .then((data) => {
        setReleases(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderInlineText = (text: string) => {
    const parts = text.split(/(\*\*[\s\S]*?\*\*|\[[\s\S]*?\]\([\s\S]*?\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-[#f4ecd8] font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.endsWith(')')) {
        const match = part.match(/\[([\s\S]*?)\]\(([\s\S]*?)\)/);
        if (match) {
          return (
            <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-[#f7ac32] hover:underline decoration-[#f7ac32] underline-offset-2">
              {match[1]}
            </a>
          );
        }
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderBody = (body: string) => {
    return body.split('\n').map((line, idx) => {
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-xl font-bold text-[#f7ac32] mt-6 mb-3">{renderInlineText(line.replace('## ', ''))}</h3>;
      }
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-lg font-bold text-[#f4ecd8] mt-5 mb-3">{renderInlineText(line.replace('### ', ''))}</h4>;
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <div key={idx} className="flex gap-3 text-sm md:text-base text-[#f4ecd8]/80 mb-3 ml-2">
            <span className="text-[#f7ac32] mt-0.5">•</span>
            <div className="flex-1 opacity-90 leading-relaxed tracking-wide">
              {renderInlineText(line.substring(2))}
            </div>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2"></div>;
      }
      return <p key={idx} className="text-sm md:text-base text-[#f4ecd8]/80 mb-3 leading-relaxed opacity-90 tracking-wide">{renderInlineText(line)}</p>;
    });
  };

  return (
    <div className="pt-24 pb-24 px-4 md:px-6 max-w-4xl mx-auto min-h-screen text-[#f4ecd8] font-sans selection:bg-[#E0005C] selection:text-white">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-[3rem] md:text-[5rem] lg:text-[6rem] leading-[0.85] font-black uppercase tracking-tighter text-[#f7ac32] mb-4">
          <AnimatedText text="WHAT'S NEW" />
        </h1>
        <div className="dotted_line w-full max-w-md my-6 opacity-30"></div>
        <p className="font-mono text-base md:text-lg text-[#f4ecd8]/70 leading-relaxed uppercase tracking-wider max-w-2xl">
          Track our latest updates, new features, and database expansions directly from GitHub.
        </p>
      </div>

      <div className="space-y-8 animate-in fade-in">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-[#f7ac32]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-mono text-sm tracking-widest uppercase">Fetching Latest Releases...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#E0005C]/5 border border-[#E0005C]/30 p-6 rounded-sm flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[#E0005C] flex-shrink-0" />
            <div>
              <h3 className="text-[#E0005C] font-bold uppercase tracking-wider mb-2">Error Loading Updates</h3>
              <p className="text-[#f4ecd8]/60 text-sm font-mono">{error}. Please try again later or visit our GitHub repository directly.</p>
            </div>
          </div>
        )}

        {!loading && !error && releases.length === 0 && (
          <div className="bg-[#151311] border border-[#f7ac32]/20 p-8 rounded-sm text-center">
            <GitBranch className="w-12 h-12 text-[#f4ecd8]/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-[#f4ecd8]/60 mb-2">No Releases Found</h3>
            <p className="text-sm font-mono text-[#f4ecd8]/40">We haven&apos;t published any releases on GitHub yet.</p>
          </div>
        )}

        {!loading && !error && releases.map((release, idx) => (
          <motion.div
            key={release.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#1c1a17] border border-[#f7ac32]/20 rounded-sm overflow-hidden"
          >
            {/* Release Header */}
            <div className="bg-[#f7ac32]/5 border-b border-[#f7ac32]/10 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <a href={release.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-[#f7ac32] decoration-2 underline-offset-4 cursor-pointer">
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[#f4ecd8] mb-2 flex items-center gap-3">
                    {release.name || release.tag_name}
                  </h2>
                </a>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-[#f4ecd8]/50">
                  <span className="flex items-center gap-1.5 bg-[#f4ecd8]/5 px-2 py-1 rounded-sm border border-[#f4ecd8]/10 text-[#f7ac32]">
                    <Tag className="w-3 h-3" /> {release.tag_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> {formatDate(release.published_at)}
                  </span>
                </div>
              </div>
              <a 
                href={release.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center justify-center w-10 h-10 border border-[#f4ecd8]/10 rounded-sm hover:border-[#f7ac32] hover:text-[#f7ac32] transition-colors"
                title="View on GitHub"
              >
                <GitBranch className="w-5 h-5" />
              </a>
            </div>

            {/* Release Body */}
            <div className="p-5 md:p-6 prose prose-invert max-w-none">
              <div className="font-mono text-sm leading-relaxed">
                {renderBody(release.body)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
