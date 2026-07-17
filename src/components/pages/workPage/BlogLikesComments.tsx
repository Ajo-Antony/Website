"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import { getOrCreateSessionId } from "@/lib/utils";
import { getBlogLikesAndComments, likeBlogPost, unlikeBlogPost, addBlogComment } from "@/lib/actions/blog";

interface BlogLikesCommentsProps {
  blogId: string;
}

export default function BlogLikesComments({ blogId }: BlogLikesCommentsProps) {
  const [likes, setLikes] = useState<{ session_id: string; user_id: string | null }[]>([]);
  const [comments, setComments] = useState<{ id: string; author_name: string; content: string; created_at: string }[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const sessionId = getOrCreateSessionId();
    // Load previously used name
    const savedName = localStorage.getItem("strixmind_commenter_name") || "";
    setCommenterName(savedName);

    setLoading(true);
    getBlogLikesAndComments(blogId).then((res) => {
      if (!res.error) {
        setLikes(res.likes);
        setComments(res.comments);
        setLikesCount(res.likesCount);
        const hasLiked = res.likes.some((l: { session_id: string }) => l.session_id === sessionId);
        setLiked(hasLiked);
      }
      setLoading(false);
    });
  }, [blogId]);

  const handleLikeToggle = async () => {
    const sessionId = getOrCreateSessionId();

    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
      await unlikeBlogPost(blogId, sessionId);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await likeBlogPost(blogId, sessionId);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingComment) return;
    
    const nameToUse = commenterName.trim() || "Anonymous";
    if (!newComment.trim()) return;

    localStorage.setItem("strixmind_commenter_name", nameToUse);

    setSubmittingComment(true);
    const res = await addBlogComment(blogId, nameToUse, newComment.trim());
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

  return (
    <div className="max-w-3xl mx-auto mt-12 border-t border-[var(--border)] pt-12 space-y-8 px-4 sm:px-0">
      
      {/* Metrics Row */}
      <div className="flex items-center gap-6 pb-6 border-b border-[var(--border)]">
        <button
          onClick={handleLikeToggle}
          className="flex items-center gap-2.5 text-[var(--text)] hover:text-rose-500 transition-colors focus:outline-none group"
        >
          <Heart
            size={24}
            className={`transition-all duration-300 ${
              liked 
                ? "fill-rose-500 text-rose-500 scale-110" 
                : "group-hover:scale-110 text-[var(--text-muted)]"
            }`}
          />
          <span className="text-sm font-bold">{likesCount} likes</span>
        </button>

        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <MessageCircle size={22} />
          <span className="text-sm font-bold">{comments.length} comments</span>
        </div>
      </div>

      {/* Write Comment Form */}
      <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">Leave a Comment</h3>
        <form onSubmit={handleAddComment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1.5">Your Name</label>
              <input
                type="text"
                placeholder="Name"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                required
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-[var(--text-muted)] uppercase mb-1.5">Comment</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Share your thoughts about this post..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-4 pr-12 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent-2 disabled:opacity-30 transition-colors"
                >
                  {submittingComment ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">Comments ({comments.length})</h3>
        
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-sm text-[var(--text-muted)] italic">No comments yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comm, index) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                className="flex gap-4 items-start bg-[var(--surface-alt)] p-4 rounded-2xl border border-[var(--border)]"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/15 to-accent-2/15 flex items-center justify-center text-xs font-bold text-accent uppercase border border-accent/10 shrink-0">
                  {comm.author_name.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-bold text-[var(--text)] truncate">{comm.author_name}</span>
                    <span className="text-xs text-[var(--text-muted)] font-mono shrink-0">
                      {new Date(comm.created_at).toLocaleDateString("en-IN", { 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text)] leading-relaxed break-words">{comm.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
