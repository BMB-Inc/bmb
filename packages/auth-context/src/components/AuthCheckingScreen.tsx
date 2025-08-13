
import React from "react";
export function AuthCheckingScreen() {
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-block',
              width: 48,
              height: 48,
              border: '6px solid #eee',
              borderTop: '6px solid #888',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 500, color: '#888' }}>
          Checking authentication...
        </div>
        <div style={{ fontSize: '0.95rem', color: '#aaa', textAlign: 'center' }}>
          Please wait while we verify your credentials
        </div>
      </div>
    </div>
  );
}