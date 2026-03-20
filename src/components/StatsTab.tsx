import React, { useState } from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { calculatePlayerStats } from '../utils/statsEngine';
import type { PlayerStats } from '../utils/statsEngine';

export const StatsTab: React.FC = () => {
  const { teams, activeTeamId } = useTeamStore();
  const team = teams.find(t => t.id === activeTeamId);
  const [sortField, setSortField] = useState<keyof PlayerStats>('AVG');
  const [sortAsc, setSortAsc] = useState(false);

  if (!team) return null;

  const playerStatsList = team.roster.map(p => {
    const pAtBats = team.atBats.filter(ab => ab.playerId === p.id);
    return calculatePlayerStats(p.id, pAtBats);
  });

  const sortedStats = [...playerStatsList].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    if (typeof valA === 'string' && valA.startsWith('.')) valA = parseFloat('0' + valA);
    else if (typeof valA === 'string') valA = parseFloat(valA);
    
    if (typeof valB === 'string' && valB.startsWith('.')) valB = parseFloat('0' + valB);
    else if (typeof valB === 'string') valB = parseFloat(valB);
    
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof PlayerStats) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const columns: { key: keyof PlayerStats, label: string, title: string }[] = [
    { key: 'GP', label: 'GP', title: 'Games Played' },
    { key: 'PA', label: 'PA', title: 'Plate Appearances' },
    { key: 'AB', label: 'AB', title: 'At Bats' },
    { key: 'R', label: 'R', title: 'Runs' },
    { key: 'H', label: 'H', title: 'Hits' },
    { key: '2B', label: '2B', title: 'Doubles' },
    { key: '3B', label: '3B', title: 'Triples' },
    { key: 'HR', label: 'HR', title: 'Home Runs' },
    { key: 'RBI', label: 'RBI', title: 'Runs Batted In' },
    { key: 'BB', label: 'BB', title: 'Walks' },
    { key: 'K', label: 'K', title: 'Strikeouts' },
    { key: 'AVG', label: 'AVG', title: 'Batting Average' },
    { key: 'OBP', label: 'OBP', title: 'On-Base Percentage' },
    { key: 'SLG', label: 'SLG', title: 'Slugging Percentage' },
    { key: 'OPS', label: 'OPS', title: 'On-Base Plus Slugging' }
  ];

  const teamStats = calculatePlayerStats('TEAM', team.atBats);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Team AVG</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-color)' }}>{teamStats.AVG}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Runs Scored</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{teamStats.R}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Home Runs</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{teamStats.HR}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Team OPS</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{teamStats.OPS}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', whiteSpace: 'nowrap' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--table-border)' }}>
              <th style={{ padding: '1.25rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-secondary)', position: 'sticky', left: 0, background: '#1c1f26', zIndex: 10 }}>Player</th>
              {columns.map(col => (
                <th 
                  key={col.key} 
                  title={col.title}
                  onClick={() => handleSort(col.key)}
                  style={{ 
                    padding: '1.25rem 0.75rem', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    color: sortField === col.key ? 'var(--accent-color)' : 'var(--text-secondary)',
                    transition: 'color 0.2s ease',
                    userSelect: 'none'
                  }}
                >
                  {col.label}
                  {sortField === col.key && <span style={{ marginLeft: '4px', fontSize: '0.8em' }}>{sortAsc ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedStats.length === 0 ? (
              <tr><td colSpan={16} style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No stats to display.</td></tr>
            ) : (
              sortedStats.map(s => {
                const p = team.roster.find(r => r.id === s.id);
                if (!p) return null;
                return (
                  <tr key={s.id} className="table-row" style={{ borderBottom: '1px solid var(--table-border)' }}>
                    <td style={{ padding: '1rem', textAlign: 'left', position: 'sticky', left: 0, background: 'var(--panel-bg)', zIndex: 9, borderRight: '1px solid var(--table-border)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>#{p.jersey}</span>
                    </td>
                    {columns.map(col => (
                      <td key={col.key} style={{ 
                        padding: '1rem 0.75rem', 
                        color: ['AVG', 'OBP', 'SLG', 'OPS'].includes(col.key) ? 'var(--accent-color)' : 'var(--text-primary)',
                        fontWeight: ['AVG', 'OPS'].includes(col.key) ? 700 : 500
                      }}>
                        {s[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
