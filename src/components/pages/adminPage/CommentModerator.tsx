"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  EyeOff, 
  Trash2, 
  Search, 
  Filter, 
  MessageSquare, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { getAdminBlogComments, updateBlogCommentStatus, deleteBlogComment } from "@/lib/actions/blog";
import { getAdminGalleryComments, updateGalleryCommentStatus, deleteGalleryComment } from "@/lib/actions/gallery";

type CommentType = "blog" | "gallery";

interface CommentItem {
  id: string;
  author_name: string;
  content: string;
  approved: boolean;
  hidden: boolean;
  created_at: string;
  blog_id?: string;
  gallery_image_id?: string;
  blog_posts?: { title: string } | null;
  gallery_images?: { caption: string | null; url: string } | null;
}

export default function CommentModerator() {
  const [activeTab, setActiveTab] = useState<CommentType>("blog");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "hidden">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loadingBulk, setLoadingBulk] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "blog") {
        const res = await getAdminBlogComments();
        if (res.error) {
          setError(res.error);
        } else {
          setComments(res.comments as CommentItem[]);
        }
      } else {
        const res = await getAdminGalleryComments();
        if (res.error) {
          setError(res.error);
        } else {
          setComments(res.comments as CommentItem[]);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchComments();
    setSelectedIds([]);
  }, [fetchComments]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      if (activeTab === "blog") {
        const res = await updateBlogCommentStatus(id, true, false);
        if (res.error) alert(res.error);
      } else {
        const res = await updateGalleryCommentStatus(id, true, false);
        if (res.error) alert(res.error);
      }
      // Update local state
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: true, hidden: false } : c))
      );
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleHide = async (id: string) => {
    setProcessingId(id);
    try {
      if (activeTab === "blog") {
        const res = await updateBlogCommentStatus(id, false, true);
        if (res.error) alert(res.error);
      } else {
        const res = await updateGalleryCommentStatus(id, false, true);
        if (res.error) alert(res.error);
      }
      // Update local state
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: false, hidden: true } : c))
      );
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this comment? This action cannot be undone.")) return;
    setProcessingId(id);
    try {
      if (activeTab === "blog") {
        const res = await deleteBlogComment(id);
        if (res.error) alert(res.error);
      } else {
        const res = await deleteGalleryComment(id);
        if (res.error) alert(res.error);
      }
      // Remove from local state
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleSelectAll = () => {
    const visibleIds = filteredComments.map((c) => c.id);
    const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => {
        const union = new Set([...prev, ...visibleIds]);
        return Array.from(union);
      });
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    setLoadingBulk(true);
    try {
      if (activeTab === "blog") {
        await Promise.all(selectedIds.map((id) => updateBlogCommentStatus(id, true, false)));
      } else {
        await Promise.all(selectedIds.map((id) => updateGalleryCommentStatus(id, true, false)));
      }
      // Update local state
      setComments((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id) ? { ...c, approved: true, hidden: false } : c
        )
      );
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || "Bulk approve failed");
    } finally {
      setLoadingBulk(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete the ${selectedIds.length} selected comments? This cannot be undone.`)) return;
    setLoadingBulk(true);
    try {
      if (activeTab === "blog") {
        await Promise.all(selectedIds.map((id) => deleteBlogComment(id)));
      } else {
        await Promise.all(selectedIds.map((id) => deleteGalleryComment(id)));
      }
      // Remove from local state
      setComments((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    } catch (err: any) {
      alert(err.message || "Bulk delete failed");
    } finally {
      setLoadingBulk(false);
    }
  };

  // Filter & Search comments
  const filteredComments = comments.filter((c) => {
    const matchesSearch = 
      c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (statusFilter === "pending") {
      return !c.approved && !c.hidden;
    }
    if (statusFilter === "approved") {
      return c.approved && !c.hidden;
    }
    if (statusFilter === "hidden") {
      return c.hidden;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-[var(--border)] gap-6">
        <button
          onClick={() => { setActiveTab("blog"); setStatusFilter("all"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all relative ${
            activeTab === "blog"
              ? "border-accent text-ink"
              : "border-transparent text-[var(--text-muted)] hover:text-ink"
          }`}
        >
          <FileText size={16} />
          Blog Comments
          {activeTab === "blog" && comments.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-accent/10 text-accent rounded-full font-bold">
              {comments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => { setActiveTab("gallery"); setStatusFilter("all"); setSearchQuery(""); }}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all relative ${
            activeTab === "gallery"
              ? "border-accent text-ink"
              : "border-transparent text-[var(--text-muted)] hover:text-ink"
          }`}
        >
          <ImageIcon size={16} />
          Gallery Comments
          {activeTab === "gallery" && comments.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-accent/10 text-accent rounded-full font-bold">
              {comments.length}
            </span>
          )}
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-[var(--surface-alt)] p-4 rounded-2xl border border-[var(--border)]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="text"
            placeholder="Search by author or comment content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-accent/40 text-ink"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1 shrink-0">
            <Filter size={12} /> Filter:
          </span>
          {(["all", "pending", "approved", "hidden"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                statusFilter === status
                  ? "bg-ink text-white border-ink"
                  : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:bg-[var(--surface-alt)] hover:text-ink"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Banner */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-accent/5 border border-accent/20 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink">
                  {selectedIds.length} {selectedIds.length === 1 ? "comment" : "comments"} selected
                </span>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-[11px] text-[var(--text-muted)] hover:text-ink underline"
                >
                  Deselect all
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={loadingBulk}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loadingBulk ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Bulk Approve
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={loadingBulk}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loadingBulk ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Bulk Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to query comments</p>
            <p className="opacity-90">{error}</p>
            <p className="mt-2 text-[10px] font-mono text-red-400/80">
              Note: Comments tables must exist with approved & hidden columns in Supabase. Check /sql/004_likes_comments.sql
            </p>
          </div>
        </div>
      )}

      {/* Comments List Stage */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="animate-spin text-accent" size={28} />
          <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest">Fetching Comments...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-16 bg-[var(--surface)] rounded-2xl border border-[var(--border)] border-dashed">
          <MessageSquare className="mx-auto text-[var(--text-muted)] opacity-30 mb-3" size={32} />
          <h3 className="text-sm font-semibold text-ink">No comments found</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-xs mx-auto">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your search query or filters to find items."
              : `There are currently no user comments in the ${activeTab} section.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All Control Bar */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[var(--text-muted)] bg-[var(--surface-alt)]/40 rounded-xl border border-[var(--border)] w-fit">
            <input
              type="checkbox"
              id="select-all-comments"
              checked={filteredComments.length > 0 && filteredComments.every((c) => selectedIds.includes(c.id))}
              onChange={handleSelectAll}
              className="rounded border-[var(--border)] text-accent focus:ring-accent/40 cursor-pointer w-4 h-4 bg-[var(--surface)] transition-all"
            />
            <label htmlFor="select-all-comments" className="font-semibold cursor-pointer select-none">
              Select all visible ({filteredComments.length})
            </label>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredComments.map((comment) => {
              // Extract target context details
              const contextTitle = activeTab === "blog" 
                ? comment.blog_posts?.title || "Blog Post" 
                : comment.gallery_images?.caption || "Gallery Image";
              const contextThumb = activeTab === "gallery" && comment.gallery_images?.url;

              // Compute status
              const isPending = !comment.approved && !comment.hidden;
              const isApproved = comment.approved && !comment.hidden;
              const isHidden = comment.hidden;

              const isSelected = selectedIds.includes(comment.id);

              return (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-[var(--surface)] border rounded-2xl p-5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative ${
                    isSelected 
                      ? "border-accent bg-accent/[0.02]" 
                      : "border-[var(--border)] hover:border-accent/30"
                  }`}
                >
                  {/* Left Side: Checkbox + Author info & Comment Text */}
                  <div className="flex-1 min-w-0 flex items-start gap-4">
                    {/* Checkbox for selection */}
                    <div className="pt-2 shrink-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(comment.id)}
                        className="rounded border-[var(--border)] text-accent focus:ring-accent/40 cursor-pointer w-4 h-4 bg-[var(--surface)] transition-all"
                      />
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/10 to-accent/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                        {comment.author_name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-ink">{comment.author_name}</span>
                          <span className="text-[10px] text-[var(--text-muted)] font-mono">
                            {new Date(comment.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>
                        {/* Parent item indicator */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[var(--text-muted)] font-mono truncate">
                          {activeTab === "blog" ? <FileText size={10} /> : <ImageIcon size={10} />}
                          <span className="uppercase tracking-wider font-bold text-[9px]">On:</span>
                          <span className="underline truncate max-w-[200px] sm:max-w-md">{contextTitle}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--text)] font-light leading-relaxed whitespace-pre-wrap pl-1">
                      {comment.content}
                    </p>

                    {/* Status badges */}
                    <div className="flex gap-2 pt-1 pl-1">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/10">
                          <CheckCircle2 size={10} /> Approved & Public
                        </span>
                      )}
                      {isHidden && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-500 border border-red-500/10">
                          <EyeOff size={10} /> Hidden / Moderated
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/10">
                          Pending Moderation
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Optional thumbnail + Moderation Actions */}
                  <div className="flex md:flex-col items-end gap-3 justify-between shrink-0">
                    {/* Thumbnail preview for gallery comments */}
                    {contextThumb && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-[var(--border)] bg-slate-900 hidden md:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={contextThumb} alt="Target thumbnail" className="object-cover w-full h-full" />
                      </div>
                    )}

                    <div className="flex gap-2 w-full md:w-auto">
                      {/* Approve Button */}
                      {!isApproved && (
                        <button
                          onClick={() => handleApprove(comment.id)}
                          disabled={processingId === comment.id}
                          className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors disabled:opacity-50"
                          title="Approve comment to show it publicly"
                        >
                          <Check size={13} />
                          Approve
                        </button>
                      )}

                      {/* Hide Button */}
                      {!isHidden && (
                        <button
                          onClick={() => handleHide(comment.id)}
                          disabled={processingId === comment.id}
                          className="flex items-center gap-1 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors disabled:opacity-50"
                          title="Hide comment from the public"
                        >
                          <EyeOff size={13} />
                          Hide
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={processingId === comment.id}
                        className="flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition-colors disabled:opacity-50 ml-auto"
                        title="Delete comment permanently"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
