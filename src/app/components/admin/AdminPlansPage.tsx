import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Pencil, Trash2, Power, BadgeDollarSign } from 'lucide-react';
import { api, type AdminPlan, type AdminPlanUpsertPayload } from '../../../services/api';

function formatCents(cents: number | null): string {
  if (cents == null) return 'Custom';
  return `$${(Number(cents) / 100).toFixed(0)}`;
}

function parseDollarsToCents(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

function centsToDollarsString(cents: number | null): string {
  if (cents == null) return '';
  return String(Math.round(cents / 100));
}

type PlanFormState = {
  slug: string;
  name: string;
  monthly_dollars: string;
  yearly_dollars: string;
  location_limit: string; // empty => unlimited (null)
  cta: string;
  highlighted: boolean;
  display_order: string;
  active: boolean;
  features_text: string; // newline-delimited
};

function planToForm(p?: AdminPlan): PlanFormState {
  return {
    slug: p?.slug ?? '',
    name: p?.name ?? '',
    monthly_dollars: centsToDollarsString(p?.monthly_price_cents ?? null),
    yearly_dollars: centsToDollarsString(p?.yearly_price_cents ?? null),
    location_limit: p?.location_limit == null ? '' : String(p.location_limit),
    cta: p?.cta ?? '',
    highlighted: p?.highlighted ?? false,
    display_order: p?.display_order == null ? '0' : String(p.display_order),
    active: p?.active ?? true,
    features_text: (p?.features ?? []).join('\n'),
  };
}

function formToPayload(f: PlanFormState): AdminPlanUpsertPayload {
  const monthly_price_cents = parseDollarsToCents(f.monthly_dollars);
  const yearly_price_cents = parseDollarsToCents(f.yearly_dollars);
  const location_limit = f.location_limit.trim() ? Number(f.location_limit) : null;
  const display_order = f.display_order.trim() ? Number(f.display_order) : 0;
  const features = f.features_text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  return {
    slug: f.slug.trim() || undefined,
    name: f.name.trim() || undefined,
    monthly_price_cents,
    yearly_price_cents,
    location_limit: Number.isFinite(location_limit as number) ? (location_limit as number) : null,
    features,
    cta: f.cta.trim() || null,
    highlighted: f.highlighted,
    display_order: Number.isFinite(display_order) ? display_order : 0,
    active: f.active,
  };
}

export function AdminPlansPage() {
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdminPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PlanFormState>(() => planToForm());

  const [showReplace, setShowReplace] = useState(false);
  const [replaceFor, setReplaceFor] = useState<{ plan: AdminPlan; action: 'deactivate' | 'delete' } | null>(null);
  const [replacementSlug, setReplacementSlug] = useState<string>('');
  const [acting, setActing] = useState(false);

  const activePlans = useMemo(() => plans.filter((p) => p.active), [plans]);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminPlans();
      setPlans(data.plans);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const openCreate = () => {
    setEditing(null);
    setForm(planToForm());
    setShowForm(true);
  };

  const openEdit = (p: AdminPlan) => {
    setEditing(p);
    setForm(planToForm(p));
    setShowForm(true);
  };

  const submitForm = async () => {
    if (!editing && !form.slug.trim()) {
      setError('Slug is required for new plans.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = formToPayload(form);
      if (editing) {
        await api.updateAdminPlan(editing.id, payload);
      } else {
        await api.createAdminPlan(payload);
      }
      setShowForm(false);
      await loadPlans();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const requestDeactivate = async (p: AdminPlan) => {
    setError(null);
    try {
      const usage = await api.getAdminPlanUsage(p.id);
      if (usage.users_count > 0) {
        setReplaceFor({ plan: p, action: 'deactivate' });
        setReplacementSlug('');
        setShowReplace(true);
        return;
      }
      setActing(true);
      await api.updateAdminPlan(p.id, { active: false });
      await loadPlans();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Deactivate failed');
    } finally {
      setActing(false);
    }
  };

  const requestDelete = async (p: AdminPlan) => {
    setError(null);
    try {
      const usage = await api.getAdminPlanUsage(p.id);
      if (usage.users_count > 0) {
        setReplaceFor({ plan: p, action: 'delete' });
        setReplacementSlug('');
        setShowReplace(true);
        return;
      }
      setActing(true);
      await api.deleteAdminPlan(p.id);
      await loadPlans();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setActing(false);
    }
  };

  const doReplacementAction = async () => {
    if (!replaceFor) return;
    if (!replacementSlug) {
      setError('Select a replacement plan.');
      return;
    }
    setActing(true);
    setError(null);
    try {
      if (replaceFor.action === 'deactivate') {
        await api.updateAdminPlan(replaceFor.plan.id, { active: false, replacement_slug: replacementSlug });
      } else {
        await api.deleteAdminPlan(replaceFor.plan.id, { replacement_slug: replacementSlug });
      }
      setShowReplace(false);
      setReplaceFor(null);
      await loadPlans();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return <div className="text-slate-500">Loading plans…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plans & Pricing</h2>
          <p className="text-slate-600">Create, edit, order, and deactivate pricing plans.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPlans}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            <Plus className="w-4 h-4" />
            Add plan
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Monthly</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Yearly</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Locations</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plans.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-700">{p.display_order}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-slate-800">{p.slug}</span>
                    {p.highlighted && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        <BadgeDollarSign className="w-3 h-3" />
                        Highlighted
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-900 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCents(p.monthly_price_cents)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCents(p.yearly_price_cents)}</td>
                  <td className="px-4 py-3 text-slate-700">{p.location_limit == null ? 'Unlimited' : p.location_limit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        p.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                      {p.active ? (
                        <button
                          onClick={() => requestDeactivate(p)}
                          disabled={acting}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          <Power className="w-4 h-4" />
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            setActing(true);
                            setError(null);
                            try {
                              await api.updateAdminPlan(p.id, { active: true });
                              await loadPlans();
                            } catch (e) {
                              setError(e instanceof Error ? e.message : 'Activate failed');
                            } finally {
                              setActing(false);
                            }
                          }}
                          disabled={acting}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                        >
                          <Power className="w-4 h-4" />
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => requestDelete(p)}
                        disabled={acting}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {plans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                    No plans yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="font-semibold text-slate-900">{editing ? `Edit: ${editing.slug}` : 'Create plan'}</div>
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                Close
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Slug {!editing && '*'}</div>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="starter"
                  disabled={!!editing}
                  required={!editing}
                />
              </label>
              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Name</div>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Starter"
                />
              </label>

              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Monthly price (USD)</div>
                <input
                  value={form.monthly_dollars}
                  onChange={(e) => setForm((s) => ({ ...s, monthly_dollars: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="29"
                />
              </label>
              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Yearly price (USD)</div>
                <input
                  value={form.yearly_dollars}
                  onChange={(e) => setForm((s) => ({ ...s, yearly_dollars: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="297"
                />
              </label>

              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Location limit (empty = unlimited)</div>
                <input
                  value={form.location_limit}
                  onChange={(e) => setForm((s) => ({ ...s, location_limit: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="5"
                />
              </label>
              <label className="text-sm">
                <div className="text-slate-700 font-medium mb-1">Display order</div>
                <input
                  value={form.display_order}
                  onChange={(e) => setForm((s) => ({ ...s, display_order: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="20"
                />
              </label>

              <label className="text-sm sm:col-span-2">
                <div className="text-slate-700 font-medium mb-1">CTA text</div>
                <input
                  value={form.cta}
                  onChange={(e) => setForm((s) => ({ ...s, cta: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  placeholder="Start Free Trial"
                />
              </label>

              <label className="text-sm sm:col-span-2">
                <div className="text-slate-700 font-medium mb-1">Features (one per line)</div>
                <textarea
                  value={form.features_text}
                  onChange={(e) => setForm((s) => ({ ...s, features_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg min-h-28"
                />
              </label>

              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.highlighted}
                    onChange={(e) => setForm((s) => ({ ...s, highlighted: e.target.checked }))}
                  />
                  Highlighted
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((s) => ({ ...s, active: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                disabled={saving}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replacement modal */}
      {showReplace && replaceFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200">
              <div className="font-semibold text-slate-900">Reassign users</div>
              <div className="text-sm text-slate-600 mt-1">
                This plan has users. Select a replacement plan before you {replaceFor.action}.
              </div>
            </div>
            <div className="p-5 space-y-3">
              <label className="text-sm block">
                <div className="text-slate-700 font-medium mb-1">Replacement plan</div>
                <select
                  value={replacementSlug}
                  onChange={(e) => setReplacementSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="">Select…</option>
                  {activePlans
                    .filter((p) => p.slug !== replaceFor.plan.slug)
                    .map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name} ({p.slug})
                      </option>
                    ))}
                </select>
              </label>
              <div className="text-xs text-slate-500">
                Users currently on <span className="font-mono">{replaceFor.plan.slug}</span> will be reassigned.
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowReplace(false);
                  setReplaceFor(null);
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={doReplacementAction}
                disabled={acting}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {acting ? 'Working…' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

