"use client";

import { useState } from "react";
import { Course, Module, Lesson } from "@/types";
import { Timestamp } from "firebase/firestore";

interface CourseFormProps {
  initialData?: Partial<Course>;
  onSubmit: (data: Omit<Course, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  submitting: boolean;
}

const emptyLesson = (): Lesson => ({
  id: crypto.randomUUID(),
  title: "",
  order: 0,
  videoUrl: "",
  duration: 0,
  isFree: false,
  description: "",
});

const emptyModule = (): Module => ({
  id: crypto.randomUUID(),
  title: "",
  order: 0,
  lessons: [emptyLesson()],
});

/** Convert a YouTube watch/short URL to embed URL */
function toEmbedUrl(url: string): string {
  if (!url) return url;
  // Already embed
  if (url.includes("youtube.com/embed/")) return url;
  // Watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // Short URL: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  return url;
}

export default function CourseForm({ initialData = {}, onSubmit, submitting }: CourseFormProps) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [description, setDescription] = useState(initialData.description ?? "");
  const [longDescription, setLongDescription] = useState(initialData.longDescription ?? "");
  const [category, setCategory] = useState(initialData.category ?? "");
  const [level, setLevel] = useState<Course["level"]>(initialData.level ?? "Beginner");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl ?? "");
  const [instructorName, setInstructorName] = useState(initialData.instructorName ?? "");
  const [price, setPrice] = useState(initialData.price?.toString() ?? "0");
  const [isFree, setIsFree] = useState(initialData.isFree ?? true);
  const [isPublished, setIsPublished] = useState(initialData.isPublished ?? false);
  const [tags, setTags] = useState(initialData.tags?.join(", ") ?? "");
  const [modules, setModules] = useState<Module[]>(
    initialData.modules?.length ? initialData.modules : [emptyModule()]
  );
  const [error, setError] = useState("");

  // ── Module helpers ──────────────────────────────────────
  const addModule = () =>
    setModules((prev) => [...prev, { ...emptyModule(), order: prev.length }]);

  const removeModule = (mIdx: number) =>
    setModules((prev) => prev.filter((_, i) => i !== mIdx));

  const updateModule = (mIdx: number, key: keyof Module, value: string) =>
    setModules((prev) =>
      prev.map((m, i) => (i === mIdx ? { ...m, [key]: value } : m))
    );

  // ── Lesson helpers ──────────────────────────────────────
  const addLesson = (mIdx: number) =>
    setModules((prev) =>
      prev.map((m, i) =>
        i === mIdx
          ? { ...m, lessons: [...m.lessons, { ...emptyLesson(), order: m.lessons.length }] }
          : m
      )
    );

  const removeLesson = (mIdx: number, lIdx: number) =>
    setModules((prev) =>
      prev.map((m, i) =>
        i === mIdx ? { ...m, lessons: m.lessons.filter((_, j) => j !== lIdx) } : m
      )
    );

  const updateLesson = (mIdx: number, lIdx: number, key: keyof Lesson, value: string | boolean | number) =>
    setModules((prev) =>
      prev.map((m, i) =>
        i === mIdx
          ? {
              ...m,
              lessons: m.lessons.map((l, j) =>
                j === lIdx ? { ...l, [key]: value } : l
              ),
            }
          : m
      )
    );

  // ── Submit ──────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Course title is required.");
    if (!instructorName.trim()) return setError("Instructor name is required.");
    if (modules.some((m) => !m.title.trim())) return setError("All modules need a title.");
    if (modules.some((m) => m.lessons.some((l) => !l.title.trim()))) return setError("All lessons need a title.");
    if (modules.some((m) => m.lessons.some((l) => !l.videoUrl.trim()))) return setError("All lessons need a YouTube URL.");

    const priceNum = parseFloat(price) || 0;
    const normalizedModules: Module[] = modules.map((m, mIdx) => ({
      ...m,
      order: mIdx,
      lessons: m.lessons.map((l, lIdx) => ({
        ...l,
        order: lIdx,
        videoUrl: toEmbedUrl(l.videoUrl),
        duration: Number(l.duration) || 0,
      })),
    }));

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      longDescription: longDescription.trim(),
      category: category.trim(),
      level,
      thumbnailUrl: thumbnailUrl.trim(),
      instructorName: instructorName.trim(),
      price: priceNum,
      isFree: priceNum === 0,
      isPublished,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      modules: normalizedModules,
    });
  };

  const inputCls = "w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";
  const labelCls = "block text-xs font-extrabold uppercase tracking-widest text-muted-foreground/70 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── Basic Info ─────────────────────────────────── */}
      <section className="bg-card rounded-2xl p-6 shadow-xl shadow-foreground/5">
        <h2 className="font-headline font-extrabold text-foreground mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Course Title *</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JavaScript for Beginners" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Short Description *</label>
            <textarea className={inputCls} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two sentences shown on the catalog card." />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Full Description</label>
            <textarea className={inputCls} rows={4} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} placeholder="Detailed description shown on the course detail page." />
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <input className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. JavaScript, Python, DevOps" />
          </div>
          <div>
            <label className={labelCls}>Level *</label>
            <select className={inputCls} value={level} onChange={(e) => setLevel(e.target.value as Course["level"])}>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Instructor Name *</label>
            <input className={inputCls} value={instructorName} onChange={(e) => setInstructorName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <label className={labelCls}>Tags (comma separated)</label>
            <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="react, hooks, frontend" />
          </div>
          <div>
            <label className={labelCls}>Thumbnail URL</label>
            <input className={inputCls} value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Price (USD)</label>
            <input className={inputCls} type="number" min="0" step="0.01" value={price} onChange={(e) => { setPrice(e.target.value); setIsFree(parseFloat(e.target.value) === 0); }} placeholder="0 for free" />
          </div>
        </div>
        <div className="flex items-center gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-primary rounded" />
            <span className="text-sm font-bold text-foreground">Publish immediately</span>
          </label>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isFree ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
            {isFree ? "Free Course" : `Paid — $${parseFloat(price) || 0}`}
          </span>
        </div>
      </section>

      {/* ── Modules & Lessons ──────────────────────────── */}
      <section className="bg-card rounded-2xl p-6 shadow-xl shadow-foreground/5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-headline font-extrabold text-foreground">Modules & Lessons</h2>
          <button type="button" onClick={addModule} className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all">
            + Add Module
          </button>
        </div>

        <div className="space-y-5">
          {modules.map((mod, mIdx) => (
            <div key={mod.id} className="border border-border rounded-2xl p-4 space-y-4">
              {/* Module header */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/60 w-20 shrink-0">
                  Module {mIdx + 1}
                </span>
                <input
                  className={inputCls}
                  value={mod.title}
                  onChange={(e) => updateModule(mIdx, "title", e.target.value)}
                  placeholder="Module title"
                />
                {modules.length > 1 && (
                  <button type="button" onClick={() => removeModule(mIdx)} className="text-rose-400 hover:text-rose-300 text-xs font-bold shrink-0">
                    Remove
                  </button>
                )}
              </div>

              {/* Lessons */}
              <div className="space-y-3 pl-4 border-l-2 border-border">
                {mod.lessons.map((lesson, lIdx) => (
                  <div key={lesson.id} className="bg-secondary/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground/60 w-16 shrink-0">
                        Lesson {lIdx + 1}
                      </span>
                      <input
                        className={inputCls}
                        value={lesson.title}
                        onChange={(e) => updateLesson(mIdx, lIdx, "title", e.target.value)}
                        placeholder="Lesson title"
                      />
                      {mod.lessons.length > 1 && (
                        <button type="button" onClick={() => removeLesson(mIdx, lIdx)} className="text-rose-400 hover:text-rose-300 text-xs font-bold shrink-0">
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>YouTube URL *</label>
                        <input
                          className={inputCls}
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(mIdx, lIdx, "videoUrl", e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        {lesson.videoUrl && (
                          <p className="text-[10px] text-muted-foreground/60 mt-1 truncate">
                            → Embed: {toEmbedUrl(lesson.videoUrl)}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>Duration (seconds)</label>
                        <input
                          className={inputCls}
                          type="number"
                          min="0"
                          value={lesson.duration}
                          onChange={(e) => updateLesson(mIdx, lIdx, "duration", parseInt(e.target.value) || 0)}
                          placeholder="600"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={lesson.isFree ?? false}
                          onChange={(e) => updateLesson(mIdx, lIdx, "isFree", e.target.checked)}
                          className="w-3.5 h-3.5 accent-primary"
                        />
                        <span className="text-xs font-bold text-muted-foreground">Free preview</span>
                      </label>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addLesson(mIdx)} className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                  + Add Lesson
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Submit ─────────────────────────────────────── */}
      {error && (
        <p className="text-sm text-rose-400 font-bold bg-rose-500/10 px-4 py-3 rounded-xl">{error}</p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-primary text-primary-foreground font-headline font-bold py-3.5 rounded-xl text-sm shadow-[0_4px_14px_rgba(0,136,255,0.25)] hover:bg-primary/90 disabled:opacity-60 transition-all"
      >
        {submitting ? "Saving..." : "Save Course"}
      </button>
    </form>
  );
}
