import React from 'react';
import { useTeamStore } from '../store/useTeamStore';
import { calculatePlayerStats } from '../utils/statsEngine';
import type { PlayerStats } from '../utils/statsEngine';

export const LeaderboardsTab: React.FC = () => {
  const { teams, activeTeamId } = useTeamStore();
  const team = teams.find(t => t.id === activeTeamId);

  if (!team) return null;

  const playerStatsList = team.roster.map(p => calculatePlayerStats(p.id, team.atBats.filter(ab => ab.playerId === p.id)));

  // Rate stats need >= 4 AB
  const qualifiedStats = playerStatsList.filter(s => s.AB >= 4);
  
  const getTop3 = (stats: PlayerStats[], field: keyof PlayerStats, isRate: boolean) => {
    const list = isRate ? qualifiedStats : stats;
    return [...list].sort((a,b) => {
      let valA = a[field];
      let valB = b[field];
      if (typeof valA === 'string' && valA.startsWith('.')) valA = parseFloat('0' + valA);
      else if (typeof valA === 'string') valA = parseFloat(valA);
      if (typeof valB === 'string' && valB.startsWith('.')) valB = parseFloat('0' + valB);
      else if (typeof valB === 'string') valB = parseFloat(valB);
      if (valA < valB) return 1;
      if (valA > valB) return -1;
      return 0;
    }).slice(0, 3); // top 3
  };

  const panels = [
    { title: 'Batting Average', field: 'AVG' as const, isRate: true },
    { title: 'Home Runs', field: 'HR' as const, isRate: false },
    { title: 'Runs Batted In', field: 'RBI' as const, isRate: false },
    { title: 'OPS', field: 'OPS' as const, isRate: true },
    { title: 'Hits', field: 'H' as const, isRate: false },
    { title: 'Runs Scored', field: 'R' as const, isRate: false },
  ];

  const medalColors = ['#f59e0b', '#94a3b8', '#d97706'];

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      {panels.map((panel) => {
        const leaders = getTop3(playerStatsList, panel.field, panel.isRate);
        
        return (
          <div key={panel.field} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {panel.title}
            </h3>
            
            {leaders.length === 0 || leaders[0][panel.field] === '0' || leaders[0][panel.field] === '.000' || leaders[0][panel.field] === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  {panel.isRate ? 'Needs 4+ AB to qualify.' : 'No stats recorded yet.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leaders.map((leader, index) => {
                  if (leader[panel.field] === '0' || leader[panel.field] === '.000' || leader[panel.field] === 0) return null;

                  const p = team.roster.find(r => r.id === leader.id);
                  return (
                    <div key={leader.id} style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      background: index === 0 ? `linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(245, 158, 11, 0.05) 100%)` : 'rgba(0,0,0,0.2)', 
                      padding: '1.25rem', borderRadius: '12px',
                      border: `1px solid ${index === 0 ? medalColors[0] + '40' : 'var(--table-border)'}`,
                      boxShadow: index === 0 ? `0 8px 16px rgba(0,0,0,0.1)` : 'none',
                      transform: index === 0 ? 'scale(1.02)' : 'scale(1)',
                      zIndex: index === 0 ? 2 : 1
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', 
                          background: medalColors[index], color: '#111', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '1rem',
                          boxShadow: `0 2px 8px ${medalColors[index]}40`
                        }}>
                          {index + 1}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '1.15rem' }}>{p?.name}</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1.4rem', color: index === 0 ? medalColors[0] : 'var(--text-primary)' }}>
                        {leader[panel.field]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
