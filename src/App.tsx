import { useState } from 'react';
import { Header } from './components/Header';
import { useTeamStore } from './store/useTeamStore';
import { RosterTab } from './components/RosterTab';
import { GamesTab } from './components/GamesTab';
import { LogTab } from './components/LogTab';
import { StatsTab } from './components/StatsTab';
import { LeaderboardsTab } from './components/LeaderboardsTab';

type Tab = 'roster' | 'games' | 'log' | 'stats' | 'leaderboards';

function App() {
  const { activeTeamId, teams } = useTeamStore();
  const [activeTab, setActiveTab] = useState<Tab>('roster');

  const activeTeam = teams.find(t => t.id === activeTeamId);

  const renderTabContent = () => {
    if (!activeTeam) {
      return (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
          <h2>No Team Selected</h2>
          <p className="subtitle" style={{ marginTop: '0.5rem' }}>Create a team to get started.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'roster': return <RosterTab />;
      case 'games': return <GamesTab />;
      case 'log': return <LogTab />;
      case 'stats': return <StatsTab />;
      case 'leaderboards': return <LeaderboardsTab />;
      default: return null;
    }
  };

  return (
    <div className="container animate-fade-in">
      <Header />

      {activeTeam && (
        <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
          {(['roster', 'games', 'log', 'stats', 'leaderboards'] as Tab[]).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: '1px solid var(--panel-border)',
                background: activeTab === tab ? 'var(--accent-color)' : 'var(--panel-bg)',
                color: activeTab === tab ? '#000' : 'var(--text-primary)',
                whiteSpace: 'nowrap'
              }}
            >
              {tab === 'log' ? 'Log At-Bat' : tab}
            </button>
          ))}
        </div>
      )}

      <main>
        {renderTabContent()}
      </main>
    </div>
  );
}

export default App;
