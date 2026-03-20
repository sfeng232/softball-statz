import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import type { AtBatResult } from '../types';
import { Undo2 } from 'lucide-react';

export const LogTab: React.FC = () => {
  const { teams, activeTeamId, logAtBat, undoLastAtBat } = useTeamStore();
  const team = teams.find(t => t.id === activeTeamId);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [rbi, setRbi] = useState(0);
  const [runScored, setRunScored] = useState(false);

  if (!team || !team.activeGameId) {
    return (
      <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No Active Game</h2>
        <p className="subtitle">Go to the Games tab and set an active game to start logging at-bats.</p>
      </div>
    );
  }

  const activeGame = team.games.find(g => g.id === team.activeGameId);
  const gameAtBats = team.atBats.filter(ab => ab.gameId === team.activeGameId).sort((a,b) => b.timestamp - a.timestamp);

  const resultButtons: { label: string, val: AtBatResult, color: string }[] = [
    { label: 'Single', val: '1B', color: '#3b82f6' },
    { label: 'Double', val: '2B', color: '#8b5cf6' },
    { label: 'Triple', val: '3B', color: '#d946ef' },
    { label: 'Home Run', val: 'HR', color: '#f59e0b' },
    { label: 'Walk', val: 'BB', color: '#10b981' },
    { label: 'Hit By Pitch', val: 'HBP', color: '#059669' },
    { label: 'Strikeout', val: 'K', color: '#ef4444' },
    { label: 'Ground Out', val: 'GO', color: '#64748b' },
    { label: 'Fly Out', val: 'FO', color: '#64748b' },
    { label: 'Line Out', val: 'LO', color: '#64748b' },
    { label: 'Fielder Choice', val: 'FC', color: '#64748b' },
    { label: 'Error', val: 'E', color: '#f43f5e' },
    { label: 'Sacrifice', val: 'SAC', color: '#fcd34d' },
    { label: 'Sac Fly', val: 'SF', color: '#fcd34d' },
    { label: 'Double Play', val: 'DP', color: '#dc2626' },
    { label: 'Interference', val: 'INT', color: '#94a3b8' },
  ];

  const handleLog = (result: AtBatResult) => {
    if (!selectedPlayerId) {
      alert("Select a batter first!");
      return;
    }

    logAtBat(team.id, {
      gameId: team.activeGameId!,
      playerId: selectedPlayerId,
      result,
      rbi,
      runScored
    });

    setRbi(0);
    setRunScored(false);
    setSelectedPlayerId('');
  };

  const undo = () => {
    if (window.confirm("Undo the very last at-bat logged in this game?")) {
      undoLastAtBat(team.id, team.activeGameId!);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem' }}>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Log At-Bat</h2>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>Active Game: vs {activeGame?.opponent}</p>

        <div style={{ marginBottom: '2.5rem' }}>
          <label className="input-label" style={{ display: 'block', marginBottom: '1rem' }}>1. Select Batter</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {team.roster.length === 0 && <span style={{ color: 'var(--text-muted)' }}>No players in roster.</span>}
            {team.roster.sort((a,b) => a.jersey - b.jersey).map(p => {
              const isSelected = selectedPlayerId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlayerId(p.id)}
                  style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '50px',
                    border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--panel-border)',
                    background: isSelected ? 'var(--accent-color)' : 'rgba(0,0,0,0.3)',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500,
                    minWidth: '80px',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  #{p.jersey} {p.name}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '2.5rem', display: 'flex', gap: '3rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--table-border)' }}>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '0.75rem' }}>RBIs on Play</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn-secondary" onClick={() => setRbi(Math.max(0, rbi - 1))} style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}>-</button>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, width: '30px', textAlign: 'center', color: 'var(--accent-color)' }}>{rbi}</span>
              <button className="btn-secondary" onClick={() => setRbi(Math.min(4, rbi + 1))} style={{ padding: '0.5rem 1rem', fontSize: '1.2rem' }}>+</button>
            </div>
          </div>
          <div>
            <label className="input-label" style={{ display: 'block', marginBottom: '0.75rem' }}>Run Scored (By Batter)</label>
            <button 
              className={`btn-secondary ${runScored ? 'active' : ''}`}
              onClick={() => setRunScored(!runScored)}
              style={{
                width: '100%',
                background: runScored ? '#10b981' : 'transparent',
                borderColor: runScored ? '#10b981' : 'var(--panel-border)',
                color: runScored ? '#fff' : 'var(--text-primary)',
                fontWeight: runScored ? 700 : 500
              }}
            >
              {runScored ? 'Yes, Scored!' : 'No'}
            </button>
          </div>
        </div>

        <div>
           <label className="input-label" style={{ display: 'block', marginBottom: '1rem' }}>2. Result & Log Play</label>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
             {resultButtons.map(btn => (
                <button 
                  key={btn.val} 
                  onClick={() => handleLog(btn.val)}
                  disabled={!selectedPlayerId}
                  style={{
                    padding: '1rem 0.5rem',
                    borderRadius: '12px',
                    background: `rgba(0,0,0,0.3)`,
                    border: `1px solid ${btn.color}40`,
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    opacity: selectedPlayerId ? 1 : 0.4,
                    cursor: selectedPlayerId ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedPlayerId ? `0 4px 12px ${btn.color}15` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedPlayerId) {
                      e.currentTarget.style.background = `${btn.color}20`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPlayerId) {
                      e.currentTarget.style.background = `rgba(0,0,0,0.3)`;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span style={{ color: btn.color, fontSize: '1.5rem', fontWeight: 800 }}>{btn.val}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{btn.label}</span>
                </button>
             ))}
           </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', maxHeight: '800px' }}>
        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <h2 className="title" style={{ fontSize: '1.2rem', margin: 0 }}>Recent Plays</h2>
          <button className="btn-icon danger" onClick={undo} title="Undo last play" disabled={gameAtBats.length === 0} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <Undo2 size={16} /> <span style={{ fontSize: '0.8rem', marginLeft: '0.5rem', fontWeight: 600 }}>Undo</span>
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.5rem' }}>
          {gameAtBats.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>No plays logged yet.</p>
          ) : (
            gameAtBats.slice(0, 15).map(ab => {
              const p = team.roster.find(r => r.id === ab.playerId);
              const rInfo = resultButtons.find(r => r.val === ab.result);
              return (
                <div key={ab.id} className="animate-fade-in" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', borderLeft: `4px solid ${rInfo?.color || 'var(--accent-color)'}` }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{p ? p.name : 'Unknown'}</span>
                    <span style={{ fontWeight: 800, color: rInfo?.color || 'var(--text-primary)', fontSize: '1.1rem' }}>{ab.result}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                    {ab.rbi > 0 && <span style={{ color: '#f59e0b', fontWeight: 600 }}>{ab.rbi} RBI</span>}
                    {ab.runScored && <span style={{ color: '#10b981', fontWeight: 600 }}>Run Scored</span>}
                    {ab.rbi === 0 && !ab.runScored && <span>-</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
