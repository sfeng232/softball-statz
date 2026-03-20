import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { Plus, Trash2, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { generateGameSummary } from '../utils/claudeApi';

export const GamesTab: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { teams, activeTeamId, createGame, deleteGame, setActiveGame, anthropicApiKey, updateGameSummary } = useTeamStore();
  const team = teams.find(t => t.id === activeTeamId);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [opponent, setOpponent] = useState('');
  const [isHome, setIsHome] = useState(true);

  if (!team) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponent.trim()) return;
    
    createGame(team.id, {
      date,
      opponent: opponent.trim(),
      isHome
    });
    setOpponent('');
  };

  const handleGenerateSummary = async (gameId: string) => {
    if (!anthropicApiKey) {
      alert('Please configure your Anthropic API Key in the Settings first!');
      return;
    }
    
    const game = team.games.find(g => g.id === gameId);
    if (!game) return;

    const gameAtBats = team.atBats.filter(ab => ab.gameId === gameId);
    if (gameAtBats.length === 0) {
      alert('Log some at-bats for this game before generating a summary!');
      return;
    }

    try {
      setIsGenerating(gameId);
      const res = await generateGameSummary(anthropicApiKey, game, team.roster, gameAtBats);
      updateGameSummary(team.id, gameId, res.summary, res.mvp);
    } catch (e: any) {
      alert('Failed to generate summary. Check console and API key.');
      console.error(e);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDelete = (gameId: string) => {
    if (window.confirm("Are you sure? This will permanently delete the game AND all logged at-bats for this game.")) {
      deleteGame(team.id, gameId);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Games Manager</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 100px auto', gap: '1rem', marginBottom: '2rem', alignItems: 'end' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Date</label>
          <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Opponent</label>
          <input type="text" className="input-field" value={opponent} onChange={e => setOpponent(e.target.value)} placeholder="e.g. Wildcats" required />
        </div>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="input-label">Location</label>
          <select className="input-field" value={isHome ? 'home' : 'away'} onChange={e => setIsHome(e.target.value === 'home')} style={{ background: '#1a1d24' }}>
            <option value="home">Home</option>
            <option value="away">Away</option>
          </select>
        </div>
        <button type="submit" className="btn-primary" style={{ height: '44px' }}>
          <Plus size={18} /> Add
        </button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {team.games.length === 0 ? (
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No games created yet. Add a game to start logging stats.</div>
        ) : (
          team.games.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(g => {
            const isActive = team.activeGameId === g.id;
            const atBatsCount = team.atBats.filter(ab => ab.gameId === g.id).length;

            return (
              <div key={g.id} style={{ 
                border: isActive ? '1px solid var(--accent-color)' : '1px solid var(--table-border)',
                borderRadius: '12px',
                padding: '1.5rem',
                background: isActive ? 'rgba(245, 158, 11, 0.05)' : 'rgba(0,0,0,0.2)'
              }}>
                <div className="flex-between">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>vs {g.opponent}</h3>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--panel-border)', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {g.isHome ? 'Home' : 'Away'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {new Date(g.date).toLocaleDateString()} &bull; {atBatsCount} At-Bats Logged
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button 
                      className="btn-secondary" 
                      onClick={() => setActiveGame(team.id, isActive ? null : g.id)}
                      style={{ 
                        borderColor: isActive ? 'var(--accent-color)' : 'var(--table-border)',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent'
                      }}
                    >
                      {isActive ? <CheckCircle size={18} /> : <Circle size={18} />}
                      {isActive ? 'Active Game' : 'Set Active'}
                    </button>
                    
                    <button className="btn-icon danger" onClick={() => handleDelete(g.id)} title="Delete Game">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--table-border)' }}>
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AI Summary</h4>
                    <button className="btn-primary" disabled={isGenerating === g.id} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', opacity: isGenerating === g.id ? 0.7 : 1 }} onClick={() => handleGenerateSummary(g.id)}>
                      <Sparkles size={14} /> {isGenerating === g.id ? 'Generating...' : 'Generate Summary'}
                    </button>
                  </div>
                  {g.summary ? (
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-color)' }}>
                      <p style={{ lineHeight: 1.6, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{g.summary}</p>
                      {g.mvp && <p style={{ fontWeight: 600, color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🏆 MVP: {g.mvp}</p>}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Generate an AI summary using Anthropic Claude.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
