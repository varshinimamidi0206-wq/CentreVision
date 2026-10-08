import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { api } from '../services/api';
import { InventoryItem, TrainingCentre } from '../types';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles,
  ShieldAlert,
  Building2,
  Upload,
  Layers,
  Wrench
} from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const { t } = useTranslation();
  const [centreId, setCentreId] = useState('TC-001');
  const [centre, setCentre] = useState<TrainingCentre | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');
  const [newItemQty, setNewItemQty] = useState(10);
  const [newItemCritical, setNewItemCritical] = useState(false);

  useEffect(() => {
    loadCentre();
  }, [centreId]);

  const loadCentre = async () => {
    setLoading(true);
    try {
      const data = await api.getCentreDetails(centreId);
      setCentre(data);
      setItems(data.inventory);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: InventoryItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      expected_qty: newItemQty,
      detected_qty: newItemQty, // Initial assumed state until audited
      is_critical: newItemCritical,
      apparent_availability: 'Appears Available',
      status: 'Compliant',
      confidence: 0.95
    };

    try {
      const updated = await api.updateInventoryItem(centreId, newItem);
      setCentre(updated);
      setItems(updated.inventory);
      setShowAddModal(false);
      setNewItemName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const remaining = items.filter((i) => i.id !== itemId);
    setItems(remaining);
  };

  const runInfrastructureAudit = async () => {
    setIsAuditing(true);
    setAuditMessage('');
    try {
      const result = await api.analyzeInfrastructure(centreId);
      setAuditMessage('Infrastructure visual audit completed successfully.');
      loadCentre();
    } catch (err) {
      setAuditMessage('Failed to complete audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  const totalSanctioned = items.reduce((acc, curr) => acc + curr.expected_qty, 0);
  const totalDetected = items.reduce((acc, curr) => acc + curr.detected_qty, 0);
  const complianceScore = totalSanctioned > 0 ? Math.round((totalDetected / totalSanctioned) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">
            {t('infrastructure.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('infrastructure.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('infrastructure.add_item')}</span>
          </button>
          <button
            onClick={runInfrastructureAudit}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-2xs disabled:opacity-50"
          >
            {isAuditing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Auditing via CV...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('infrastructure.run_audit')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Operability Scientific Disclaimer (Section 19) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-950 font-bold mb-0.5">
            Apparent Visual Availability Standard (Section 19):
          </strong>
          {t('infrastructure.operability_note')}
        </div>
      </div>

      {/* Centre Selector & KPI Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-xs">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
            Active Centre Under Audit
          </label>
          <select
            value={centreId}
            onChange={(e) => setCentreId(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
          >
            <option value="TC-001">TC-001: Sri Skill Development (Visakhapatnam)</option>
            <option value="TC-002">TC-002: Rural Skills Training (Chittoor)</option>
            <option value="TC-003">TC-003: Advanced Technical Training (Vijayawada)</option>
          </select>
        </div>

        <div className="text-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Sanctioned Assets</span>
          <strong className="text-xl font-bold text-slate-900">{totalSanctioned}</strong>
        </div>

        <div className="text-center p-2.5 bg-blue-50 rounded-lg border border-blue-200">
          <span className="text-[10px] text-blue-700 font-semibold uppercase block">Visually Detected</span>
          <strong className="text-xl font-bold text-blue-800">{totalDetected}</strong>
        </div>

        <div className="text-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">Infrastructure Compliance</span>
          <strong
            className={`text-xl font-black ${
              complianceScore >= 90 ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {complianceScore}%
          </strong>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            {t('infrastructure.sanctioned_inventory')}
          </h3>
          <span className="text-xs text-slate-500">
            {items.length} Registered Asset Categories
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">{t('infrastructure.item_name')}</th>
                <th className="py-3 px-4">{t('infrastructure.category')}</th>
                <th className="py-3 px-4 text-center">{t('infrastructure.expected_qty')}</th>
                <th className="py-3 px-4 text-center">{t('infrastructure.detected_qty')}</th>
                <th className="py-3 px-4">{t('infrastructure.visual_availability')}</th>
                <th className="py-3 px-4">{t('common.status')}</th>
                <th className="py-3 px-4 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.is_critical && (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Critical
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                  <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{item.expected_qty}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-bold ${
                        item.detected_qty >= item.expected_qty ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.detected_qty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        item.apparent_availability === 'Appears Available'
                          ? 'text-emerald-700'
                          : item.apparent_availability === 'Partially Obstructed'
                          ? 'text-amber-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {item.apparent_availability}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Compliant'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100"
                      title="Remove asset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Sanctioned Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 text-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Add Sanctioned Centre Infrastructure
            </h3>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Equipment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Oscilloscope, Electrician Workbench"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Furniture">Furniture & Seating</option>
                  <option value="IT Infrastructure">IT Infrastructure / Computers</option>
                  <option value="Vocational Equipment">Vocational Tools & Equipment</option>
                  <option value="Industrial Machinery">Industrial Machinery</option>
                  <option value="Safety Apparatus">Safety & Fire Extinguishers</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Sanctioned Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  required
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="criticalCheck"
                  checked={newItemCritical}
                  onChange={(e) => setNewItemCritical(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="criticalCheck" className="text-slate-700 font-semibold cursor-pointer">
                  Mark as Statutory Critical Equipment
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
