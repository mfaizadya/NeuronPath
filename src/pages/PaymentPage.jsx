import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Crown, CheckCircle2, Loader2, ChevronRight,
  ShieldCheck, ArrowLeft, Smartphone, Building2,
  CreditCard, Wallet, Lock, X, AlertTriangle,
  KeyRound, RefreshCw
} from 'lucide-react';
import './PaymentPage.css';

const BYPASS_CODE = 'NEURON2026';

const PAYMENT_METHODS = [
  {
    group: 'Transfer Bank',
    icon: Building2,
    options: [
      { id: 'bca', label: 'BCA Virtual Account', logo: 'BCA' },
      { id: 'bni', label: 'BNI Virtual Account', logo: 'BNI' },
      { id: 'bri', label: 'BRI Virtual Account', logo: 'BRI' },
      { id: 'mandiri', label: 'Mandiri Virtual Account', logo: 'MND' },
    ],
  },
  {
    group: 'E-Wallet',
    icon: Smartphone,
    options: [
      { id: 'gopay', label: 'GoPay', logo: 'GP' },
      { id: 'ovo', label: 'OVO', logo: 'OVO' },
      { id: 'dana', label: 'DANA', logo: 'DNA' },
      { id: 'shopeepay', label: 'ShopeePay', logo: 'SPY' },
    ],
  },
  {
    group: 'Kartu Kredit / Debit',
    icon: CreditCard,
    options: [
      { id: 'visa', label: 'Visa / Mastercard', logo: 'VISA' },
    ],
  },
  {
    group: 'QRIS',
    icon: Wallet,
    options: [
      { id: 'qris', label: 'QRIS (Semua E-Wallet)', logo: 'QR' },
    ],
  },
  {
    group: 'Kode Aktivasi',
    icon: KeyRound,
    options: [
      { id: 'activation_code', label: 'Kode Aktivasi Premium', logo: 'KEY' },
    ],
  },
];

const STEPS = ['Pilih Metode', 'Detail Pembayaran', 'Konfirmasi'];

// ---- Error Modal ----
function ErrorModal({ message, onClose, onRetry }) {
  return (
    <div className="payment-error-overlay">
      <div className="payment-error-modal animate-fade-in">
        <div className="payment-error-modal__icon">
          <AlertTriangle size={32} />
        </div>
        <h3>Pembayaran Gagal</h3>
        <p>{message}</p>
        <div className="payment-error-modal__actions">
          <button className="payment-error-modal__retry" onClick={onRetry}>
            <RefreshCw size={16} /> Coba Lagi
          </button>
          <button className="payment-error-modal__close" onClick={onClose}>
            <X size={16} /> Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { upgradePremium, user } = useAuth();

  const [step, setStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState(null); // null | string (pesan error)

  // Kode aktivasi state
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [activationProcessing, setActivationProcessing] = useState(false);

  const isActivationCode = selectedMethod === 'activation_code';

  const handleSelectMethod = (optionId) => {
    setSelectedMethod(optionId);
    setActivationError('');
    setActivationCode('');
  };

  const handleNext = () => {
    if (!selectedMethod) return;
    setStep(1);
  };

  const handleConfirm = () => setStep(2);

  // Pembayaran normal — selalu gagal (simulasi)
  const handlePay = async () => {
    setProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2200));
      // Simulasi gagal untuk metode pembayaran biasa
      throw new Error('Transaksi tidak dapat diproses. Server pembayaran tidak merespons. Silakan coba beberapa saat lagi atau gunakan metode pembayaran lain.');
    } catch (err) {
      setProcessing(false);
      setErrorModal(err.message);
    }
  };

  // Kode aktivasi — bypass langsung ke premium
  const handleActivationCode = async () => {
    setActivationError('');
    if (!activationCode.trim()) {
      setActivationError('Masukkan kode aktivasi terlebih dahulu.');
      return;
    }
    if (activationCode.trim().toUpperCase() !== BYPASS_CODE) {
      setActivationError('Kode aktivasi tidak valid atau sudah kadaluarsa.');
      return;
    }
    setActivationProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      await upgradePremium();
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setActivationProcessing(false);
      setErrorModal('Gagal mengaktifkan kode. Silakan coba lagi.');
    }
  };

  const selectedOption = PAYMENT_METHODS.flatMap(g => g.options).find(o => o.id === selectedMethod);

  if (success) {
    return (
      <div className="payment-page">
        <div className="payment-success animate-fade-in-up">
          <div className="payment-success__icon">
            <CheckCircle2 size={56} />
          </div>
          <h2>Aktivasi Berhasil!</h2>
          <p>Akun kamu sudah diupgrade ke <strong>NeuronPath Premium</strong>. Selamat menikmati semua fitur!</p>
          <div className="payment-success__loader">
            <Loader2 size={18} className="spin" />
            <span>Mengalihkan ke dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {/* Error Modal */}
      {errorModal && (
        <ErrorModal
          message={errorModal}
          onClose={() => setErrorModal(null)}
          onRetry={() => { setErrorModal(null); }}
        />
      )}

      {/* Header */}
      <div className="payment-header">
        <button className="payment-back" onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)}>
          <ArrowLeft size={18} /> Kembali
        </button>
        <div className="payment-header__brand">
          <Crown size={18} />
          <span>NeuronPath Premium</span>
        </div>
        <div className="payment-header__secure">
          <Lock size={14} />
          <span>Transaksi Aman</span>
        </div>
      </div>

      <div className="payment-body">
        {/* Order Summary */}
        <aside className="payment-summary glass-card">
          <div className="payment-summary__badge">
            <Crown size={16} /> Premium Plan
          </div>
          <h3 className="payment-summary__title">NeuronPath Pro</h3>
          <p className="payment-summary__desc">Akses penuh semua fitur premium selama 1 bulan</p>

          <div className="payment-summary__features">
            {[
              'Unlimited AI Consultation',
              'Smart Insight & Rekomendasi',
              'Radar & Bar Chart Dashboard',
            ].map(f => (
              <div key={f} className="payment-summary__feature">
                <CheckCircle2 size={15} />
                <span>{f}</span>
              </div>
            ))}
          </div>

          <div className="payment-summary__divider" />

          <div className="payment-summary__row">
            <span>Subtotal</span>
            <span>Rp 29.000</span>
          </div>
          <div className="payment-summary__row">
            <span>PPN (11%)</span>
            <span>Rp 3.190</span>
          </div>
          <div className="payment-summary__divider" />
          <div className="payment-summary__row payment-summary__row--total">
            <span>Total</span>
            <span>{isActivationCode ? 'Gratis' : 'Rp 32.190'}</span>
          </div>

          <div className="payment-summary__user">
            <span>Akun:</span>
            <strong>{user?.email}</strong>
          </div>
        </aside>

        {/* Main Panel */}
        <div className="payment-main">
          {/* Stepper — sembunyikan untuk activation code */}
          {!isActivationCode && (
            <div className="payment-stepper">
              {STEPS.map((label, i) => (
                <div
                  key={label}
                  className={`payment-step ${i === step ? 'payment-step--active' : ''} ${i < step ? 'payment-step--done' : ''}`}
                >
                  <div className="payment-step__dot">
                    {i < step ? <CheckCircle2 size={14} /> : <span>{i + 1}</span>}
                  </div>
                  <span className="payment-step__label">{label}</span>
                  {i < STEPS.length - 1 && <div className="payment-step__line" />}
                </div>
              ))}
            </div>
          )}

          {/* Step 0 — Pilih Metode */}
          {step === 0 && (
            <div className="payment-card glass-card animate-fade-in">
              <h3 className="payment-card__title">Pilih Metode Pembayaran</h3>
              <div className="payment-methods">
                {PAYMENT_METHODS.map(group => (
                  <div key={group.group} className="payment-methods__group">
                    <div className="payment-methods__group-label">
                      <group.icon size={15} />
                      {group.group}
                    </div>
                    <div className="payment-methods__options">
                      {group.options.map(opt => (
                        <button
                          key={opt.id}
                          className={`payment-method-btn ${selectedMethod === opt.id ? 'payment-method-btn--selected' : ''} ${opt.id === 'activation_code' ? 'payment-method-btn--bypass' : ''}`}
                          onClick={() => handleSelectMethod(opt.id)}
                        >
                          <div className={`payment-method-btn__logo ${opt.id === 'activation_code' ? 'payment-method-btn__logo--key' : ''}`}>
                            {opt.id === 'activation_code' ? <KeyRound size={16} /> : opt.logo}
                          </div>
                          <div className="payment-method-btn__info">
                            <span className="payment-method-btn__label">{opt.label}</span>
                            {opt.id === 'activation_code' && (
                              <span className="payment-method-btn__sublabel">Masukkan kode untuk aktivasi instan</span>
                            )}
                          </div>
                          <div className={`payment-method-btn__radio ${selectedMethod === opt.id ? 'payment-method-btn__radio--checked' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Jika activation code dipilih, langsung tampilkan input di step 0 */}
              {isActivationCode ? (
                <div className="payment-activation">
                  <h4 className="payment-activation__title">
                    <KeyRound size={16} /> Masukkan Kode Aktivasi
                  </h4>
                  <div className="payment-activation__input-wrap">
                    <input
                      className={`payment-activation__input ${activationError ? 'payment-activation__input--error' : ''}`}
                      type="text"
                      placeholder="Contoh: NEURON2026"
                      value={activationCode}
                      onChange={e => { setActivationCode(e.target.value.toUpperCase()); setActivationError(''); }}
                      maxLength={20}
                      spellCheck={false}
                    />
                    {activationError && (
                      <p className="payment-activation__error">
                        <AlertTriangle size={14} /> {activationError}
                      </p>
                    )}
                  </div>
                  <button
                    className="payment-action-btn"
                    onClick={handleActivationCode}
                    disabled={activationProcessing}
                  >
                    {activationProcessing
                      ? <><Loader2 size={18} className="spin" /> Memverifikasi...</>
                      : <><KeyRound size={16} /> Aktifkan Sekarang</>
                    }
                  </button>
                </div>
              ) : (
                <button
                  className="payment-action-btn"
                  onClick={handleNext}
                  disabled={!selectedMethod}
                >
                  Lanjutkan <ChevronRight size={18} />
                </button>
              )}
            </div>
          )}

          {/* Step 1 — Detail */}
          {step === 1 && (
            <div className="payment-card glass-card animate-fade-in">
              <h3 className="payment-card__title">Detail Pembayaran</h3>
              <div className="payment-detail-method">
                <div className="payment-detail-method__logo">{selectedOption?.logo}</div>
                <div>
                  <strong>{selectedOption?.label}</strong>
                  <p>Total yang harus dibayar: <strong>Rp 32.190</strong></p>
                </div>
              </div>

              {['bca', 'bni', 'bri', 'mandiri'].includes(selectedMethod) && (
                <div className="payment-instructions">
                  <h4>Nomor Virtual Account</h4>
                  <div className="payment-va">
                    <span className="payment-va__number">8277 4821 9034 7712</span>
                    <button className="payment-va__copy" onClick={() => navigator.clipboard?.writeText('8277482190347712')}>
                      Salin
                    </button>
                  </div>
                  <ol className="payment-steps-list">
                    <li>Buka aplikasi mobile banking atau ATM</li>
                    <li>Pilih menu Transfer / Bayar</li>
                    <li>Masukkan nomor Virtual Account di atas</li>
                    <li>Konfirmasi pembayaran sebesar <strong>Rp 32.190</strong></li>
                  </ol>
                </div>
              )}

              {['gopay', 'ovo', 'dana', 'shopeepay'].includes(selectedMethod) && (
                <div className="payment-instructions">
                  <h4>Scan QR Code</h4>
                  <div className="payment-qr">
                    <div className="payment-qr__mock">
                      <div className="payment-qr__inner" />
                    </div>
                    <p>Buka aplikasi e-wallet kamu dan scan QR di atas</p>
                  </div>
                  <ol className="payment-steps-list">
                    <li>Buka aplikasi {selectedOption?.label}</li>
                    <li>Pilih menu Scan / Bayar</li>
                    <li>Scan QR code di atas</li>
                    <li>Konfirmasi pembayaran sebesar <strong>Rp 32.190</strong></li>
                  </ol>
                </div>
              )}

              {selectedMethod === 'visa' && (
                <div className="payment-instructions">
                  <h4>Data Kartu</h4>
                  <div className="payment-card-form">
                    <div className="form-group">
                      <label className="form-label">Nomor Kartu</label>
                      <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="payment-card-form__row">
                      <div className="form-group">
                        <label className="form-label">Exp. Date</label>
                        <input className="form-input" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input className="form-input" placeholder="•••" maxLength={3} type="password" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nama di Kartu</label>
                      <input className="form-input" placeholder="NAMA LENGKAP" />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === 'qris' && (
                <div className="payment-instructions">
                  <h4>QRIS — Bayar dengan Semua E-Wallet</h4>
                  <div className="payment-qr">
                    <div className="payment-qr__mock payment-qr__mock--qris">
                      <div className="payment-qr__inner" />
                    </div>
                    <p>Scan menggunakan GoPay, OVO, DANA, ShopeePay, atau m-banking apapun</p>
                  </div>
                </div>
              )}

              <button className="payment-action-btn" onClick={handleConfirm}>
                Konfirmasi Pembayaran <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2 — Konfirmasi */}
          {step === 2 && (
            <div className="payment-card glass-card animate-fade-in">
              <h3 className="payment-card__title">Konfirmasi Pesanan</h3>

              <div className="payment-confirm-rows">
                <div className="payment-confirm-row">
                  <span>Paket</span>
                  <strong>NeuronPath Premium — 1 Bulan</strong>
                </div>
                <div className="payment-confirm-row">
                  <span>Metode Bayar</span>
                  <strong>{selectedOption?.label}</strong>
                </div>
                <div className="payment-confirm-row">
                  <span>Email</span>
                  <strong>{user?.email}</strong>
                </div>
                <div className="payment-confirm-row payment-confirm-row--total">
                  <span>Total Pembayaran</span>
                  <strong>Rp 32.190</strong>
                </div>
              </div>

              <div className="payment-secure-note">
                <ShieldCheck size={16} />
                <span>Transaksi ini dienkripsi dan aman. Dengan melanjutkan, kamu menyetujui syarat & ketentuan NeuronPath.</span>
              </div>

              <button
                className="payment-action-btn"
                onClick={handlePay}
                disabled={processing}
              >
                {processing
                  ? <><Loader2 size={18} className="spin" /> Memproses Pembayaran...</>
                  : <><Lock size={16} /> Bayar Sekarang</>
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
