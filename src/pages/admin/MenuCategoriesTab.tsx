import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import type { MenuCategory } from '../../types';
import { generateSlug } from '../../utils/helpers';
import { api } from '../../utils/api';
import { INPUT_CLASS, PRIMARY_BTN, SECONDARY_BTN } from './shared';

export default function MenuCategoriesTab() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({ nameEn: '', nameAr: '', sortOrder: '0' });

  const resetForm = () => setFormData({ nameEn: '', nameAr: '', sortOrder: '0' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        const payload = {
          name: { en: formData.nameEn, ar: formData.nameAr },
          slug: editingCategory.slug,
          sortOrder: parseInt(formData.sortOrder) || 0,
        };
        const updated = await api.menuCategories.update(editingCategory.id, payload);
        dispatch({ type: 'UPDATE_MENU_CATEGORY', payload: updated });
      } else {
        const payload = {
          name: { en: formData.nameEn, ar: formData.nameAr },
          slug: generateSlug(formData.nameEn || formData.nameAr || ''),
          sortOrder: parseInt(formData.sortOrder) || 0,
        };
        const created = await api.menuCategories.create(payload);
        dispatch({ type: 'ADD_MENU_CATEGORY', payload: created });
      }

      setShowForm(false);
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.name.en,
      nameAr: category.name.ar,
      sortOrder: String(category.sortOrder ?? 0),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, slug: string) => {
    if (deletingIds.has(id)) return;

    const hasItems = state.menuItems.some(item => item.categorySlug === slug);
    if (hasItems) {
      alert('Cannot delete a category that still has menu items. Move or delete those items first.');
      return;
    }

    if (!confirm('Delete this category?')) return;

    setDeletingIds(new Set([...deletingIds, id]));
    try {
      await api.menuCategories.delete(id);
      dispatch({ type: 'DELETE_MENU_CATEGORY', payload: id });
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category. Please try again.');
    } finally {
      const next = new Set(deletingIds);
      next.delete(id);
      setDeletingIds(next);
    }
  };

  const sorted = [...state.menuCategories].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">{state.menuCategories.length} categories</p>
        <button
          onClick={() => { setShowForm(true); setEditingCategory(null); resetForm(); }}
          className={PRIMARY_BTN}
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-lg font-semibold text-secondary">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h4>
            <button onClick={() => setShowForm(false)} aria-label="Close form" className="text-muted hover:text-secondary">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input value={formData.nameEn} onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))} placeholder="Name (English)" className={INPUT_CLASS} required />
              <input value={formData.nameAr} onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))} placeholder="Name (Arabic)" dir="rtl" className={INPUT_CLASS} />
            </div>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={e => setFormData(prev => ({ ...prev, sortOrder: e.target.value }))}
              placeholder="Sort order (lower shows first)"
              className={`${INPUT_CLASS} max-w-xs`}
            />

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className={PRIMARY_BTN}>{editingCategory ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowForm(false)} className={SECONDARY_BTN}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-muted text-center py-12">No categories yet — add your first one above.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(category => {
            const itemCount = state.menuItems.filter(i => i.categorySlug === category.slug).length;
            return (
              <div key={category.id} className="bg-white border border-border/70 rounded-2xl p-5 shadow-soft space-y-3">
                <div>
                  <h4 className="font-display text-lg font-semibold text-secondary">{category.name.en}</h4>
                  {category.name.ar && <div className="text-foreground/60 text-sm" dir="rtl">{category.name.ar}</div>}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono-label text-muted">
                  <span>/{category.slug}</span>
                  <span>·</span>
                  <span>{itemCount} item{itemCount === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => handleEdit(category)} className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors" aria-label="Edit category">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(category.id, category.slug); }}
                    disabled={deletingIds.has(category.id)}
                    className="p-2 rounded-lg border border-border hover:border-error hover:text-error transition-colors disabled:opacity-50"
                    aria-label="Delete category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
