import { useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { useApp } from '../../context/appcontext';
import type { Testimonial } from '../../types';
import { api } from '../../utils/api';
import { INPUT_CLASS, PRIMARY_BTN, SECONDARY_BTN } from './shared';

const emptyForm = { customerName: '', quote: '', rating: 5, sortOrder: '0' };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n === 1 ? '' : 's'}`}
          className="p-0.5"
        >
          <Star size={22} className={n <= value ? 'text-primary fill-primary' : 'text-border'} />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsTab() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState(emptyForm);

  const resetForm = () => setFormData(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      customerName: formData.customerName,
      quote: formData.quote,
      rating: formData.rating,
      sortOrder: parseInt(formData.sortOrder) || 0,
    };

    try {
      if (editing) {
        const updated = await api.testimonials.update(editing.id, payload);
        dispatch({ type: 'UPDATE_TESTIMONIAL', payload: updated });
      } else {
        const created = await api.testimonials.create(payload);
        dispatch({ type: 'ADD_TESTIMONIAL', payload: created });
      }
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      alert('Failed to save testimonial. Please try again.');
    }
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setFormData({
      customerName: t.customerName,
      quote: t.quote,
      rating: t.rating,
      sortOrder: String(t.sortOrder ?? 0),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (deletingIds.has(id)) return;
    if (!confirm('Delete this testimonial?')) return;

    setDeletingIds(new Set([...deletingIds, id]));
    try {
      await api.testimonials.delete(id);
      dispatch({ type: 'DELETE_TESTIMONIAL', payload: id });
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      alert('Failed to delete testimonial. Please try again.');
    } finally {
      const next = new Set(deletingIds);
      next.delete(id);
      setDeletingIds(next);
    }
  };

  const sorted = [...state.testimonials].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm">
          {state.testimonials.length} testimonials — curated here directly, no customer order verification.
        </p>
        <button onClick={() => { setShowForm(true); setEditing(null); resetForm(); }} className={PRIMARY_BTN}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-border/70 rounded-2xl p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-lg font-semibold text-secondary">
              {editing ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h4>
            <button onClick={() => setShowForm(false)} aria-label="Close form" className="text-muted hover:text-secondary">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              value={formData.customerName}
              onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Guest name"
              className={INPUT_CLASS}
              required
            />
            <textarea
              value={formData.quote}
              onChange={e => setFormData(prev => ({ ...prev, quote: e.target.value }))}
              placeholder="Quote"
              rows={3}
              className={INPUT_CLASS}
              required
            />
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-muted mb-1">Rating</div>
                <StarPicker value={formData.rating} onChange={n => setFormData(prev => ({ ...prev, rating: n }))} />
              </div>
              <div className="flex-1 max-w-[140px]">
                <div className="text-xs text-muted mb-1">Sort order</div>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={e => setFormData(prev => ({ ...prev, sortOrder: e.target.value }))}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button type="submit" className={PRIMARY_BTN}>{editing ? 'Update' : 'Add'}</button>
              <button type="button" onClick={() => setShowForm(false)} className={SECONDARY_BTN}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-muted text-center py-12">No testimonials yet — add your first one above.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sorted.map(t => (
            <div key={t.id} className="bg-white border border-border/70 rounded-2xl p-5 shadow-soft space-y-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < t.rating ? 'text-primary fill-primary' : 'text-border'} />
                ))}
              </div>
              <p className="text-foreground/80 text-sm italic">“{t.quote}”</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-secondary">{t.customerName}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(t)} className="p-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors" aria-label="Edit testimonial">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                    disabled={deletingIds.has(t.id)}
                    className="p-2 rounded-lg border border-border hover:border-error hover:text-error transition-colors disabled:opacity-50"
                    aria-label="Delete testimonial"
                  >
                    <Trash2 size={14} />
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
