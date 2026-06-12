import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '40px 20px',
          textAlign: 'center',
          color: 'var(--text-primary, #f1f5f9)',
        }}>
          <AlertTriangle size={48} style={{ color: '#f59e0b', marginBottom: 16 }} />
          <h2 style={{ marginBottom: 8, fontSize: '1.5rem' }}>Terjadi Kesalahan</h2>
          <p style={{
            color: 'var(--text-secondary, #94a3b8)',
            marginBottom: 24,
            maxWidth: 400,
          }}>
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              background: 'var(--accent-blue, #00d4ff)',
              color: '#0f172a',
              border: 'none',
              borderRadius: 8,
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
