"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Heart, MessageCircle, Send, Loader2, Play, Pause } from "lucide-react";
import type { GalleryImage } from "@/lib/types/content";
import { getOrCreateSessionId, blurDataURL } from "@/lib/utils";
import { getGalleryLikesAndComments, likeGalleryImage, unlikeGalleryImage, addGalleryComment } from "@/lib/actions/gallery";

export default function GalleryClient({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Likes & Comments State
  const [likes, setLikes] = useState<{ session_id: string; user_id: string | null }[]>([]);
  const [comments, setComments] = useState<{ id: string; author_name: string; content: string; created_at: string }[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length]);

  // Fetch Likes & Comments when activeIndex changes
  useEffect(() => {
    if (activeIndex === null) return;
    const activeImage = images[activeIndex];
    const sessionId = getOrCreateSessionId();

    setLoadingDetails(true);
    // Initialize/reset commenter name from localStorage if available
    const savedName = localStorage.getItem("strixmind_commenter_name") || "";
    setCommenterName(savedName);

    getGalleryLikesAndComments(activeImage.id).then((res) => {
      if (!res.error) {
        setLikes(res.likes);
        setComments(res.comments);
        setLikesCount(res.likesCount);
        const hasLiked = res.likes.some((l: { session_id: string }) => l.session_id === sessionId);
        setLiked(hasLiked);
      }
      setLoadingDetails(false);
    });
  }, [activeIndex, images]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleLikeToggle = async () => {
    if (activeIndex === null) return;
    const activeImage = images[activeIndex];
    const sessionId = getOrCreateSessionId();

    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      await unlikeGalleryImage(activeImage.id, sessionId);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await likeGalleryImage(activeImage.id, sessionId);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex === null || submittingComment) return;
    const activeImage = images[activeIndex];
    
    const nameToUse = commenterName.trim() || "Anonymous";
    if (!newComment.trim()) return;

    // Save name in localStorage
    localStorage.setItem("strixmind_commenter_name", nameToUse);

    setSubmittingComment(true);
    const res = await addGalleryComment(activeImage.id, nameToUse, newComment.trim());
    setSubmittingComment(false);

    if (res.error) {
      alert(res.error);
    } else {
      setComments((prev) => [
        ...prev,
        {
          id: "temp_" + Date.now(),
          author_name: nameToUse,
          content: newComment.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setNewComment("");
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-24 bg-[var(--surface-alt)] rounded-3xl border border-[var(--border)] border-dashed">
        <p className="text-[var(--text-muted)] text-base font-light">No gallery snapshots yet — check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, index) => {
          return (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
              onClick={() => setActiveIndex(index)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-alt)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_12px_36px_rgba(0,0,0,0.04)] aspect-square"
            >
              {/* Premium overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />

              {img.media_type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={img.url}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/60 text-white/90 text-[10px] font-mono tracking-wider uppercase z-20">
                    Video
                  </div>
                </div>
              ) : (
                <Image
                  src={img.url}
                  alt={img.alt ?? ""}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  placeholder="blur"
                  blurDataURL={blurDataURL}
                />
              )}

              {/* Action indicator icon */}
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 z-20">
                <Maximize2 size={14} />
              </div>

              {/* Text caption content on hover */}
              <div className="absolute inset-x-0 bottom-0 p-5 z-20 transform translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 space-y-1.5 text-left">
                {img.title ? (
                  <h3 className="text-white text-sm font-bold tracking-tight drop-shadow-md truncate">
                    {img.title}
                  </h3>
                ) : (
                  <h3 className="text-white text-sm font-bold tracking-tight drop-shadow-md truncate">
                    Strixmind Build Snapshot
                  </h3>
                )}
                {img.caption && (
                  <p className="text-white/80 text-xs drop-shadow-sm line-clamp-2">
                    {img.caption}
                  </p>
                )}
                {img.tags && img.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1.5">
                    {img.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono bg-white/15 border border-white/10 text-white/95 px-1.5 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal — Instagram Split Panel Style */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 sm:p-6"
            onClick={() => setActiveIndex(null)}
          >
            {/* Split Panel Stage */}
            <div
              className="relative max-w-6xl w-full h-[90vh] md:h-[80vh] bg-[#0c0c0e] rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Container (Left Panel) */}
              <div className="relative w-full h-[45%] md:h-full md:w-[60%] lg:w-[65%] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10 select-none">
                
                {/* Navigation Arrows inside media box */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/10 transition-all transform hover:scale-105 active:scale-95 z-30"
                  aria-label="Previous item"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white border border-white/10 transition-all transform hover:scale-105 active:scale-95 z-30"
                  aria-label="Next item"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Media Element */}
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="relative w-full h-full flex items-center justify-center"
                    >
                      {images[activeIndex].media_type === "video" ? (
                        <video
                          src={images[activeIndex].url}
                          controls
                          autoPlay
                          loop
                          playsInline
                          className="max-w-full max-h-full object-contain rounded-xl"
                        />
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={images[activeIndex].url}
                            alt={images[activeIndex].alt ?? ""}
                            fill
                            sizes="70vw"
                            className="object-contain"
                            priority
                            referrerPolicy="no-referrer"
                            placeholder="blur"
                            blurDataURL={blurDataURL}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Mobile-only Close button on top of media */}
                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute top-4 right-4 md:hidden p-2 rounded-full bg-black/60 text-white border border-white/10"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Comments & Likes Container (Right Panel) */}
              <div className="w-full h-[55%] md:h-full md:w-[40%] lg:w-[35%] bg-[#0e0e11] flex flex-col justify-between text-white">
                
                {/* Header (Caption) */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400">
                      SM
                    </div>
                    <div>
                      <div className="text-xs font-bold tracking-wide">StrixMind</div>
                      <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Creator</div>
                    </div>
                  </div>
                  
                  {/* Desktop-only Close button in header */}
                  <button
                    onClick={() => setActiveIndex(null)}
                    className="hidden md:block p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Main Content Area (Caption text + scrollable comments list) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                  {/* Item Description / Caption */}
                  <div className="pb-4 border-b border-white/5 space-y-3">
                    {images[activeIndex].title && (
                      <div>
                        <p className="text-[10px] text-white/45 font-mono mb-0.5 uppercase tracking-wider">TITLE</p>
                        <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                          {images[activeIndex].title}
                        </h4>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-white/45 font-mono mb-0.5 uppercase tracking-wider">CAPTION</p>
                      <p className="text-xs text-white/80 leading-relaxed font-light">
                        {images[activeIndex].caption || "A premium snapshot showcasing a build highlight of StrixMind."}
                      </p>
                    </div>
                    {images[activeIndex].tags && images[activeIndex].tags.length > 0 && (
                      <div>
                        <p className="text-[10px] text-white/45 font-mono mb-1 uppercase tracking-wider">TAGS</p>
                        <div className="flex flex-wrap gap-1.5">
                          {images[activeIndex].tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-white/40 tracking-wider uppercase">Comments ({comments.length})</p>
                    
                    {loadingDetails ? (
                      <div className="py-8 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500" size={20} />
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-xs text-white/40 italic">No comments yet. Be the first to share your thoughts!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {comments.map((comm) => (
                          <div key={comm.id} className="flex gap-2.5 items-start bg-white/3 px-3 py-2.5 rounded-2xl border border-white/5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300 uppercase shrink-0 border border-white/5">
                              {comm.author_name.slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-1.5 mb-0.5">
                                <span className="text-xs font-bold text-white/90 truncate">{comm.author_name}</span>
                                <span className="text-[9px] text-white/30 shrink-0">
                                  {new Date(comm.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              <p className="text-xs text-white/80 leading-normal break-words">{comm.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Section: Likes counter & Post a comment */}
                <div className="p-4 border-t border-white/10 bg-[#0a0a0c] space-y-3">
                  
                  {/* Interaction buttons (Like / Share) */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLikeToggle}
                      className="flex items-center gap-2 text-white/80 hover:text-rose-500 transition-colors focus:outline-none group"
                    >
                      <Heart
                        size={22}
                        className={`transition-all duration-300 ${
                          liked 
                            ? "fill-rose-500 text-rose-500 scale-110" 
                            : "group-hover:scale-110 text-white/70"
                        }`}
                      />
                      <span className="text-xs font-bold">{likesCount} likes</span>
                    </button>
                    
                    <div className="flex items-center gap-1.5 text-white/60">
                      <MessageCircle size={20} />
                      <span className="text-xs font-bold">{comments.length} comments</span>
                    </div>
                  </div>

                  {/* Comment Input Form */}
                  <form onSubmit={handleAddComment} className="space-y-2.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={commenterName}
                        onChange={(e) => setCommenterName(e.target.value)}
                        required
                        className="w-[35%] bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500/50"
                      />
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50"
                        />
                        <button
                          type="submit"
                          disabled={submittingComment || !newComment.trim()}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 disabled:opacity-30 disabled:hover:text-indigo-400 transition-colors"
                        >
                          {submittingComment ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Send size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
