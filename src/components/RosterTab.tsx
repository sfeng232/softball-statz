import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { Plus, Trash2 } from 'lucide-react';
import type { Position } from '../types';

export const RosterTab: React.FC = () => {
  const { teams, activeTeamId, addPlayer, removePlayer } = useTeamStore();
  const team = teams.find(t => t.id === activeTeamId);

  const [name, setName] = useState('');
  const [jersey, setJersey] = useState('');
  const [position, setPosition] = useState<Position>('P');

  if (!team) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !jersey) return;
    
    addPlayer(team.id, {
      name: name.trim(),
      jersey: parseInt(jersey, 10),
      position
    });
    
    setName('');
    setJersey('');
    setPosition('P');
  };

  const positions: Position[] = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'UT'];

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Team Roster</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px auto', gap: '1rem', marginBottom: '2rem', alignItems: 'end' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Player Name</label>
          <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Mike Trout" />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Jersey #</label>
          <input type="number" min="0" max="99" className="input-field" value={jersey} onChange={e => setJersey(e.target.value)} required />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Position</label>
          <select className="input-field" value={position} onChange={e => setPosition(e.target.value as Position)} style={{ background: '#1a1d24' }}>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ height: '44px' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--table-border)' }}>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Jersey</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Name</th>
            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Position</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {team.roster.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No players in roster. Add players to begin.</td></tr>
          ) : (
            team.roster.sort((a,b) => a.jersey - b.jersey).map(p => (
              <tr key={p.id} className="table-row" style={{ borderBottom: '1px solid var(--table-border)' }}>
                <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--accent-color)' }}>#{p.jersey}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.position}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button className="btn-icon danger" onClick={() => removePlayer(team.id, p.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
