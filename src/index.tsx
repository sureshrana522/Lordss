
import React, { ReactNode, ErrorInfo, Suspense, Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ErrorBoundary class to catch crashes
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState;
  readonly props: Readonly<ErrorBoundaryProps>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("FATAL_SYSTEM_CRASH:", error, errorInfo);
    // Ensure shell is hidden so error screen can show
    const hide = (window as any).hideAppShell;
    if (typeof hide === 'function') hide();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px 20px', 
          color: '#ff4444', 
          backgroundColor: '#000', 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h2 style={{ fontFamily: 'Cinzel, serif', marginBottom: '12px', fontSize: '20px', color: '#b38728', letterSpacing: '4px' }}>KERNEL ERROR</h2>
          <p style={{ color: '#666', fontSize: '11px', marginBottom: '20px', textTransform: 'uppercase' }}>System Recoverable Error</p>
          <pre style={{ 
            padding: '15px', 
            backgroundColor: '#09090b', 
            borderRadius: '12px', 
            fontSize: '9px', 
            color: '#f87171', 
            border: '1px solid #1a1a1a', 
            textAlign: 'left', 
            maxWidth: '90vw', 
            overflow: 'auto',
            maxHeight: '200px',
            whiteSpace: 'pre-wrap'
          }}>
            {/* FIX: Render the message string, NOT the object. This causes Error #31 */}
            {this.state.error?.message || "Unknown System Error"}
          </pre>
          <button 
            onClick={() => {
                localStorage.clear();
                window.location.reload();
            }} 
            style={{ 
              marginTop: '40px', 
              padding: '14px 40px', 
              backgroundColor: '#b38728', 
              border: 'none', 
              borderRadius: '12px', 
              color: '#000', 
              fontWeight: '900', 
              cursor: 'pointer', 
              textTransform: 'uppercase', 
              letterSpacing: '2px' 
            }}
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <Suspense fallback={null}>
           <App />
        </Suspense>
      </ErrorBoundary>
    );
  } catch (err) {
    console.error("Mounting Error:", err);
  }
}
