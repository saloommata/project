import { useState } from 'react';
import { Plus, Pencil, Trash2, X, ImagePlus } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import type { MenuItem } from '../../types';
import { api } from '../../utils/api';
import { uploadToBackend, INPUT_CLASS, PRIMARY_BTN, SECONDARY_BTN } from './shared';

const emptyForm = {
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  price: '',
  categorySlug: '',
  isFeatured: false,
  isAvailable: true,
  sortOrder: '0',
  image: '',
};

export default function MenuItemsTab() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState(emptyForm);

  const sortedCategories = [...state.menuCategories].sort((a, b) => a.sortOrder - b.sortOrder);

  const resetForm = () => setFormData({ ...emptyForm, categorySlug: sortedCategories[0]?.slug ?? '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categorySlug) {
      alert('Please add a category first (Categories tab), then choose it here.');
      return;
    }

    const price = parseFloat(formData.price);
    if (Number.isNaN(price) || price < 0) {
      alert('Please enter a valid price.');
      return;
    }

    const payload = {
      name: { en: formData.nameEn, ar: formData.nameAr },
      description: { en: formData.descriptionEn, ar: formData.descriptionAr },
      price,
      categorySlug: formData.categorySlug,
      image: formData.image || undefined,
      isFeatured: formData.isFeatured,
      isAvailable: formData.isAvailable,
      sortOrder: parseInt(formData.sortOrder) || 0,
    };

    try {
      if (editingItem) {
        const updated = await api.menuItems.update(editingItem.id, payload);
        dispatch({ type: 'UPDATE_MENU_ITEM', payload: updated });
      } else {
        const created = await api.menuItems.create(payload);
        dispatch({ type: 'ADD_MENU_ITEM', payload: created });
      }

      setShowForm(false);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save menu item:', error);
      alert('Failed to save menu item. Please try again.');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      nameEn: item.name.en,
      nameAr: item.name.ar,
      descriptionEn: item.description.en,
      descriptionAr: item.description.ar,
      price: String(item.price),
      categorySlug: item.categorySlug,
      isFeatured: item.isFeatured,
      isAvailable: item.isAvailable,
      sortOrder: String(item.sortOrder ?? 0),
      image: item.image ?? '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (deletingIds.has(id)) return;
    if (!confirm('Delete this menu item?')) return;

    setDeletingIds(new Set([...deletingIds, id]));
    try {
      await api.menuItems.delete(id);
      dispatch({ type: 'DELETE_MENU_ITEM', payload: id });
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    } finally {
      const next = new Set(deletingIds);
      next.delete(id);
      setDeletingIds(next);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToBackend(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const categoryName = (slug: string) => state.menuCategories.find(c => c.slug === slug)?.name.en ?? slug;

  const visibleItems = (categoryFilter === 'all'
    ? state.menuItems
    : state.menuItems.filter(i => i.categorySlug === categoryFilter)
  ).slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              categoryFilter === 'all' ? 'bg-secondary text-white border-secondary' : 'border-border text-foreground/70 hover:border-primary'
            }`}
          >
            All ({state.menuItems.length})
          </button>
          {sortedCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                categoryFilter === cat.slug ? 'bg-secondary text-white border-secondary' : 'border-border text-foreground/70 hover:border-primary'
              }`}
            >
              {cat.name.en}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setShowForm(true); setEditingItem(null); resetForm(); }}
          className={PRIMARY_BTN}
          disabled={state.menuCategories.length === 0}
          title={state.menuCategories.length === 0 ? 'Add a category first' : undefined}
        >
          <Plus size={16} /> Add Menu Item
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-lg font-semibold text-secondary">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h4>
            <button onClick={() => setShowForm(false)} aria-label="Close form" className="text-muted hover:text-secondary">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <input value={formData.nameEn} onChange={e => setFormData(prev => ({ ...prev, nameEn: e.target.value }))} placeholder="Name (English)" className={INPUT_CLASS} required />
              <input value={formData.nameAr} onChange={e => setFormData(prev => ({ ...prev, nameAr: e.target.value }))} placeholder="Name (Arabic)" dir="rtl" className={INPUT_CLASS} />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <textarea value={formData.descriptionEn} onChange={e => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))} placeholder="Description (English)" rows={2} className={INPUT_CLASS} />
              <textarea value={formData.descriptionAr} onChange={e => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))} placeholder="Description (Arabic)" dir="rtl" rows={2} className={INPUT_CLASS} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Price (KWD)"
                className={INPUT_CLASS}
                required
              />
              <select
                value={formData.categorySlug}
                onChange={e => setFormData(prev => ({ ...prev, categorySlug: e.target.value }))}
                className={INPUT_CLASS}
                required
              >
                <option value="" disabled>Choose category…</option>
                {sortedCategories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name.en}</option>
                ))}
              </select>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={e => setFormData(prev => ({ ...prev, sortOrder: e.target.value }))}
                placeholder="Sort order"
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-foreground/80">
                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))} className="rounded accent-primary" />
                Featured item
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground/80">
                <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))} className="rounded accent-primary" />
                Available today
              </label>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted">Photo</div>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border">
                    <img src={formData.image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      aria-label="Remove image"
                      className="absolute -top-1.5 -right-1.5 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center text-muted">
                    <ImagePlus size={20} />
                  </div>
                )}
                <label className={`${SECONDARY_BTN} cursor-pointer`}>
                  {uploading ? 'Uploading…' : 'Choose Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className={PRIMARY_BTN}>{editingItem ? 'Update Item' : 'Add Item'}</button>
              <button type="button" onClick={() => setShowForm(false)} className={SECONDARY_BTN}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {visibleItems.length === 0 ? (
        <p className="text-muted text-center py-12">
          {state.menuCategories.length === 0
            ? 'Add a category first, then add menu items to it.'
            : 'No menu items yet — add your first one above.'}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map(item => (
            <div key={item.id} className="bg-white border border-border/70 rounded-2xl overflow-hidden shadow-soft flex flex-col">
              <div className="h-36 bg-border/30 relative">
                {item.image ? (
                  <img src={item.image} alt={item.name.en} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted text-sm">No photo</div>
                )}
                {!item.isAvailable && (
                  <span className="absolute top-2 right-2 bg-error text-white text-[10px] font-mono-label px-2 py-0.5 rounded-full">
                    UNAVAILABLE
                  </span>
                )}
                {item.isFeatured && (
                  <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-mono-label px-2 py-0.5 rounded-full">
                    FEATURED
                  </span>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-base font-semibold text-secondary leading-snug">{item.name.en}</h4>
                  <span className="font-mono-label text-sm text-primary whitespace-nowrap">{item.price.toFixed(3)} KD</span>
                </div>
                <p className="text-muted text-xs">{categoryName(item.categorySlug)}</p>
                {item.description.en && <p className="text-foreground/60 text-sm line-clamp-2">{item.description.en}</p>}
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button onClick={() => handleEdit(item)} className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors" aria-label="Edit item">
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    disabled={deletingIds.has(item.id)}
                    className="p-2 rounded-lg border border-border hover:border-error hover:text-error transition-colors disabled:opacity-50"
                    aria-label="Delete item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
