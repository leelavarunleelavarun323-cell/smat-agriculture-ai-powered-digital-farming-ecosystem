import React, { useState, useEffect } from 'react';
import { CommunityPost } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { useNotifications } from '../../context/NotificationContext.tsx';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';

export const FarmerCommunityView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);

  // Ask Question Form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Crop');

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community/posts');
      const json = await res.json();
      if (json.success && json.data) {
        setPosts(json.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likesCount: json.data.likesCount, isLikedByUser: json.data.isLikedByUser }
              : p
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/community/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });
      const json = await res.json();
      if (json.success) {
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        showToast('Comment submitted');
        await fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          category: newCategory
        })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Discussion question posted!');
        setShowAskModal(false);
        setNewTitle('');
        setNewContent('');
        await fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = posts.filter((p) => {
    const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-green-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 mb-2">
            <Users className="h-3.5 w-3.5" /> Peer-to-Peer Agronomy Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Farmer Community & Expert Advisory
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            Collaborate with progressive farmers, verified university agronomists, and government extension officers. Discuss pest alerts, market rates, and biological farming methods.
          </p>
        </div>
      </div>

      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {['ALL', 'Crop', 'Pest', 'Weather', 'Market', 'Technology', 'Government Schemes'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat === 'ALL' ? 'All Discussions' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" /> Ask Community Question
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-300">
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-stone-900">{post.authorName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                      {post.authorRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {post.authorLocation}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <h2 className="text-base font-bold text-stone-900">{post.title}</h2>
              <p className="text-xs text-stone-600 leading-relaxed">{post.content}</p>
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center gap-4 pt-2 border-t border-stone-100 text-xs text-stone-500">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 font-bold transition-colors ${
                  post.isLikedByUser ? 'text-emerald-600' : 'hover:text-stone-900'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${post.isLikedByUser ? 'fill-emerald-600' : ''}`} />
                <span>{post.likesCount} Helpful</span>
              </button>

              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0} Expert Answers</span>
              </span>
            </div>

            {/* Replies section */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-2.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-900 font-bold">{comment.authorName}</strong>
                        {comment.isExpert && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                            <ShieldCheck className="h-2.5 w-2.5 text-emerald-700" /> Agronomist Verified
                          </span>
                        )}
                        <span className="text-[10px] text-stone-400">
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed text-[11px]">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder="Provide agricultural advice or ask a follow-up..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCommentSubmit(post.id);
                    }
                  }}
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
                  title="Submit reply"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-extrabold text-stone-900 text-base">Ask Agricultural Community Question</h3>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Topic Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="Crop">Crop Care & Seed Varieties</option>
                  <option value="Pest">Pest & Disease Diagnosis</option>
                  <option value="Weather">Weather Advisory</option>
                  <option value="Market">Market Prices & Procurement</option>
                  <option value="Technology">Solar & Drip Irrigation Tech</option>
                  <option value="Government Schemes">PM Kisan / State Subsidies</option>
                  <option value="General">General Farming Discussion</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Question Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Yellow rust visible on wheat leaves after heavy fog?"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Describe your soil conditions, crop stage, and observed symptoms..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
