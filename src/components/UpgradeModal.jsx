import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Crown, CheckCircle2, Sparkles } from 'lucide-react';
import './UpgradeModal.css';

export default function UpgradeModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    navigate('/payment');
  };

  return (
    <div className="upgrade-modal-overlay">
      <div className="upgrade-modal">
        <button className="upgrade-modal__close" onClick={onClose}>
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

          <button className="upgrade-btn" onClick={handleProceed}>
            <Sparkles size={18} /> Lanjut ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
