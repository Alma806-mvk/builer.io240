import React, { useState } from "react";
import InteractiveCanvasFoundation from "./canvas/InteractiveCanvasFoundation";
import { CanvasItemType } from "../types";

interface CanvasFoundationDemoProps {
  onClose?: () => void;
}

export const CanvasFoundationDemo: React.FC<CanvasFoundationDemoProps> = ({ onClose }) => {
  const [demoMode, setDemoMode] = useState<'full' | 'minimal'>('full');
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="canvas-foundation-demo">
      {/* Header */}
      <div className="demo-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="demo-title">
              <span className="title-highlight">High-Performance</span>
              <span className="title-main">Canvas Foundation</span>
            </h1>
            <p className="demo-subtitle">
              Pure CSS grid background with buttery smooth interactions
            </p>
          </div>
          
          <div className="header-controls">
            <div className="mode-toggle">
              <button
                onClick={() => setDemoMode('full')}
                className={`mode-button ${demoMode === 'full' ? 'active' : ''}`}
              >
                Full Demo
              </button>
              <button
                onClick={() => setDemoMode('minimal')}
                className={`mode-button ${demoMode === 'minimal' ? 'active' : ''}`}
              >
                Minimal
              </button>
            </div>
            
            {onClose && (
              <button onClick={onClose} className="close-button">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions Panel */}
      {showInstructions && (
        <div className="instructions-panel">
          <div className="instructions-content">
            <h3 className="instructions-title">
              <span className="instruction-icon">🚀</span>
              Interactive Canvas Features
            </h3>
            
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🎨</span>
                <div>
                  <strong>Pure CSS Grid</strong>
                  <p>Dual-layer grid background with zero JavaScript rendering</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <div>
                  <strong>Smooth Panning</strong>
                  <p>Spacebar + drag or middle mouse for 1:1 movement</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
                <div>
                  <strong>Zoom to Cursor</strong>
                  <p>Ctrl/Cmd + wheel zooms towards your mouse position</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">✨</span>
                <div>
                  <strong>Hover Effects</strong>
                  <p>Subtle glow and elevation on object interaction</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <div>
                  <strong>Selection States</strong>
                  <p>Clear visual feedback for selected objects</p>
                </div>
              </div>
              
              <div className="feature-item">
                <span className="feature-icon">🔧</span>
                <div>
                  <strong>Hardware Accelerated</strong>
                  <p>GPU-optimized transforms and rendering</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setShowInstructions(false)}
              className="close-instructions"
            >
              Got it! Let me try →
            </button>
          </div>
        </div>
      )}

      {/* Canvas Demo */}
      <div className="canvas-demo-area">
        <InteractiveCanvasFoundation 
          className="demo-canvas"
          enableToolbar={demoMode === 'full'}
          onAddItem={(type: CanvasItemType) => {
            console.log(`Demo: Added ${type} to canvas`);
          }}
        />
      </div>

      <style>{`
        .canvas-foundation-demo {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .demo-header {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          padding: 20px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .title-section {
          flex: 1;
        }

        .demo-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .title-highlight {
          background: linear-gradient(135deg, #38BDF8, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-main {
          color: white;
        }

        .demo-subtitle {
          font-size: 16px;
          color: rgba(148, 163, 184, 0.9);
          margin: 0;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .mode-toggle {
          display: flex;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          padding: 4px;
          border: 1px solid rgba(100, 116, 139, 0.2);
        }

        .mode-button {
          padding: 8px 16px;
          background: transparent;
          border: none;
          color: rgba(148, 163, 184, 0.9);
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mode-button.active {
          background: linear-gradient(135deg, #38BDF8, #8B5CF6);
          color: white;
          box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
        }

        .mode-button:hover:not(.active) {
          color: white;
          background: rgba(59, 130, 246, 0.1);
        }

        .close-button {
          width: 32px;
          height: 32px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          color: #F87171;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .close-button:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .instructions-panel {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          background: rgba(30, 41, 59, 0.98);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 16px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.3);
          max-width: 800px;
          width: 90vw;
          max-height: 80vh;
          overflow-y: auto;
        }

        .instructions-content {
          padding: 32px;
        }

        .instructions-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
        }

        .instruction-icon {
          font-size: 28px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .feature-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(100, 116, 139, 0.2);
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-item:hover {
          border-color: rgba(56, 189, 248, 0.4);
          background: rgba(56, 189, 248, 0.05);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .feature-item strong {
          color: white;
          display: block;
          margin-bottom: 4px;
          font-size: 16px;
        }

        .feature-item p {
          color: rgba(148, 163, 184, 0.9);
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .close-instructions {
          background: linear-gradient(135deg, #38BDF8, #8B5CF6);
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
        }

        .close-instructions:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(56, 189, 248, 0.4);
        }

        .canvas-demo-area {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .demo-canvas {
          width: 100%;
          height: 100%;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .demo-title {
            font-size: 24px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .instructions-content {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default CanvasFoundationDemo;
