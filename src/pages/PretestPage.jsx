import { Link } from 'react-router-dom';
import { Brain, Sparkles, ArrowRight, CheckCircle2, ListChecks, Clock } from 'lucide-react';
import './PretestPage.css';

export default function PretestPage() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          <span className="gradient-text">Pretest</span> Pembelajaran
        </h1>
        <p className="page-subtitle">
          Ketahui Pola dan Gaya Belajarmu melalui asesmen cerdas!
        </p>
      </div>

      {/* Info Card */}
      <div className="pretest-info glass-card">
        <div className="pretest-info__hero">
          <div className="pretest-info__icon-wrap">
            <Brain size={48} />
          </div>
          <h2>Ketahui Pola Belajarmu!</h2>
          <p>
            Isi <strong>15 pertanyaan</strong> (9 Pola + 6 Gaya) untuk mendapatkan 
            wawasan profil belajar Anda yang akurat!
          </p>
        </div>

        <div className="pretest-details">
          <div className="pretest-detail-card">
            <div className="pretest-detail__icon pretest-detail__icon--blue">
              <ListChecks size={22} />
            </div>
            <div>
              <h4>Pola Belajar</h4>
              <p>9 pertanyaan untuk menganalisis konsistensi, kecepatan, refleksi, dan keseimbangan belajar Anda</p>
            </div>
          </div>
          <div className="pretest-detail-card">
            <div className="pretest-detail__icon pretest-detail__icon--purple">
              <Sparkles size={22} />
            </div>
            <div>
              <h4>Gaya Belajar</h4>
              <p>6 pertanyaan untuk menentukan preferensi Visual, Auditori, atau Kinestetik Anda</p>
            </div>
          </div>
          <div className="pretest-detail-card">
            <div className="pretest-detail__icon pretest-detail__icon--green">
              <Clock size={22} />
            </div>
            <div>
              <h4>Estimasi Waktu</h4>
              <p>Sekitar 3-5 menit untuk menyelesaikan seluruh pertanyaan</p>
            </div>
          </div>
        </div>

        <div className="pretest-instructions">
          <h3>Petunjuk Pengerjaan</h3>
          <ul>
            <li><CheckCircle2 size={16} /> Jawab setiap pertanyaan dengan jujur sesuai kebiasaan belajar Anda</li>
            <li><CheckCircle2 size={16} /> Gunakan skala 1 (Sangat Tidak Setuju) hingga 5 (Sangat Setuju)</li>
            <li><CheckCircle2 size={16} /> Tidak ada jawaban benar atau salah</li>
            <li><CheckCircle2 size={16} /> Hasil analisis akan tampil setelah menyelesaikan seluruh soal</li>
          </ul>
        </div>

        <div className="pretest-action">
          <Link to="/test" className="btn btn-primary btn-lg">
            Mulai Pretest Sekarang
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
