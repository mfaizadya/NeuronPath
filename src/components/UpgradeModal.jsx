import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Crown, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import './UpgradeModal.css';

export default function UpgradeModal({ isOpen, onClose }) {
  const { upgradePremium } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    setLoading(true);
    // Simulasi loading payment gateway (2 detik)
    setTimeout(async () => {
      try {
        await upgradePremium();
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setLoading(false);
        }, 1500);
      } catch (err) {
        console.error('Upgrade failed', err);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="upgrade-modal-overlay">
      <div className="upgrade-modal">
        <button className="upgrade-modal__close" onClick={onClose} disabled={loading || success}>
          <X size={20} />
        </button>

        <div className="upgrade-modal__header">
          <div className="upgrade-modal__icon">
            <Crown size={32} />
          </div>
          <h2 className="upgrade-modal__title">Upgrade ke Premium</h2>
          <p className="upgrade-modal__subtitle">
            Buka seluruh fitur analitik mendalam dan konsultasi AI tanpa batas.
          </p>
        </div>

        <div className="upgrade-modal__body">
          <div className="upgrade-features">
            <div className="upgrade-feature">
              <CheckCircle2 size={18} className="upgrade-feature__icon" />
              <span className="upgrade-feature__text"><strong>Unlimited</strong> AI Consultation</span>
            </div>
            <div className="upgrade-feature">
              <CheckCircle2 size={18} className="upgrade-feature__icon" />
              <span className="upgrade-feature__text">Akses <strong>Smart Insight & Rekomendasi</strong></span>
            </div>
            <div className="upgrade-feature">
              <CheckCircle2 size={18} className="upgrade-feature__icon" />
              <span className="upgrade-feature__text">Membuka <strong>Radar & Bar Chart</strong> Dashboard</span>
            </div>
          </div>

          <div className="upgrade-pricing">
            <span className="upgrade-pricing__amount">Rp 29.000</span>
            <span className="upgrade-pricing__period">/ bulan</span>
          </div>

          <button 
            className="upgrade-btn" 
            onClick={handleUpgrade}
            disabled={loading || success}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" /> Memproses...</>
            ) : success ? (
              <><CheckCircle2 size={18} /> Berhasil!</>
            ) : (
              <><Sparkles size={18} /> Beli Sekarang</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
