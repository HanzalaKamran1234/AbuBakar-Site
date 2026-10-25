"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  UploadCloud,
  Layers,
} from "lucide-react";
import { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState("");

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setDisplayOrder((categories.length + 1).toString());
    setModalError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setDisplayOrder(cat.displayOrder?.toString() || "1");
    setModalError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!name.trim()) {
      setModalError("Category name is required.");
      return;
    }

    setIsSaving(true);
    const payload = {
      ...(editingCategory ? { id: editingCategory.id } : {}),
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, "-"),
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      displayOrder: parseInt(displayOrder, 10) || 1,
    };

    try {
      const endpoint = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Failed to save category.");
        setIsSaving(false);
        return;
      }

      showNotification(`Category "${payload.name}" saved successfully.`);
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      setModalError("Error saving category: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        showNotification(data.error || "Cannot delete category.", "error");
        setCategoryToDelete(null);
        setIsDeleting(false);
        return;
      }

      showNotification(`Category "${categoryToDelete.name}" deleted.`);
      setCategoryToDelete(null);
      loadCategories();
    } catch (err: any) {
      showNotification("Error deleting category: " + err.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border text-xs font-bold uppercase tracking-wider flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
            notification.type === "success"
              ? "bg-black/95 text-emerald-400 border-emerald-500/30"
              : "bg-black/95 text-red-400 border-red-500/30"
          }`}
        >
          {notification.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <span className="text-gold text-[10px] font-bold uppercase tracking-[0.3em] block mb-1">
            Collections & Categories
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Category <span className="gold-gradient italic">Organization</span>
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Organize shoes into collections (Sneakers, Formal, Casual, Limited) visible across your store.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="gold-button px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          <PlusCircle size={16} />
          Create New Category
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-gold mb-3" size={32} />
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Loading categories...</p>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between hover:border-gold/30 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center font-black text-sm">
                      #{cat.displayOrder || 1}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-gold transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        /collections/{cat.slug}
                      </span>
                    </div>
                  </div>

                  <span className="bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Package size={12} className="text-gold" />
                    {cat.productCount || 0} Shoes
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed mb-6 line-clamp-2">
                  {cat.description || "No description provided for this collection."}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <a
                  href={`/collections/${cat.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold uppercase tracking-wider text-gold hover:underline"
                >
                  View on Boutique ↗
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <FolderTree size={36} className="text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white uppercase">No Categories Created</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Categories help customers navigate your footwear collection by style.
          </p>
          <button
            onClick={openCreateModal}
            className="gold-button px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <PlusCircle size={14} /> Add Category
          </button>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                    }
                  }}
                  placeholder="e.g. Boots, Oxford, Loafers"
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="boots"
                    className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-zinc-300 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    Display Order (Rank)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Collection Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the footwear styles and craftsmanship in this collection..."
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Cover Image URL (Optional)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/15 focus:border-gold px-4 py-3 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="gold-button px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="animate-spin" size={14} />}
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl space-y-6">
            <div className="flex items-center gap-4 text-red-400">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Delete Category
                </h3>
                <p className="text-[11px] text-zinc-400">Safe deletion check</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-white font-bold">"{categoryToDelete.name}"</strong>?
            </p>

            {(categoryToDelete.productCount || 0) > 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                ⚠️ Warning: There are currently <strong>{categoryToDelete.productCount} products</strong> assigned to this category. The system will prevent deletion until you reassign or delete those products first.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
