import React, { useState, useEffect } from 'react';
import { X, Key } from 'lucide-react';
import { useTeamStore } from '../store/useTeamStore';

export const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { anthropicApiKey, setApiKey } = useTeamStore();
  const [keyInput, setKeyInput] = useState('');

  useEffect(() => {
    if (isOpen) setKeyInput(anthropicApiKey || '');
  }, [isOpen, anthropicApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput.trim() || '');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={24} /> Settings
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="input-group">
          <label className="input-label">Anthropic API Key (Claude)</label>
          <input 
            type="password" 
            className="input-field" 
            value={keyInput} 
            onChange={(e) => setKeyInput(e.target.value)} 
            placeholder="sk-ant-api03-..." 
          />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Required to generate AI game summaries. Your key is stored securely in your browser's local storage and is never sent to any backend database.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};
