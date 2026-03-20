import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { SettingsModal } from './SettingsModal';

export const Header: React.FC = () => {
  const { teams, activeTeamId, switchTeam, createTeam, deleteTeam } = useTeamStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeTeam = teams.find(t => t.id === activeTeamId);

  const handleCreateTeam = () => {
    const name = window.prompt("Enter new team name:");
    if (name?.trim()) createTeam(name.trim());
  };

  const handleDeleteTeam = () => {
    if (!activeTeam) return;
    if (window.confirm(`Are you sure you want to delete ${activeTeam.name} and ALL its data?`)) {
      deleteTeam(activeTeam.id);
    }
  };

  return (
    <>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 0',
        borderBottom: '1px solid var(--panel-border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 className="title" style={{ margin: 0, fontSize: '1.75rem' }}>Statz</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.5rem', borderRadius: '8px' }}>
            <select 
              value={activeTeamId || ''} 
              onChange={(e) => switchTeam(e.target.value)}
              style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {teams.length === 0 && <option value="" disabled>No Teams</option>}
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            
            <button className="btn-icon" onClick={handleCreateTeam} title="Create Team">
              <Plus size={16} />
            </button>
            {activeTeam && (
              <button className="btn-icon danger" onClick={handleDeleteTeam} title="Delete Team">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <button className="btn-icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings size={22} />
        </button>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
