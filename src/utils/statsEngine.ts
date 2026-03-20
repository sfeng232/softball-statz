import type { AtBat } from '../types';

export interface PlayerStats {
  id: string;
  GP: number; // For simplicity, we can calculate GP by counting unique gameIds this player has an AtBat in
  PA: number;
  AB: number;
  R: number;
  H: number;
  '2B': number;
  '3B': number;
  HR: number;
  RBI: number;
  BB: number;
  K: number;
  AVG: string;
  OBP: string;
  SLG: string;
  OPS: string;
}

export function calculatePlayerStats(playerId: string, atBats: AtBat[]): PlayerStats {
  let PA = 0, AB = 0, R = 0, H = 0, _2B = 0, _3B = 0, HR = 0, RBI = 0, BB = 0, K = 0, HBP = 0, SF = 0;
  
  const uniqueGames = new Set<string>();

  for (const ab of atBats) {
    uniqueGames.add(ab.gameId);
    PA++;
    R += ab.runScored ? 1 : 0;
    RBI += ab.rbi;
    
    switch (ab.result) {
      case '1B': H++; AB++; break;
      case '2B': _2B++; H++; AB++; break;
      case '3B': _3B++; H++; AB++; break;
      case 'HR': HR++; H++; AB++; break;
      case 'BB': BB++; break;
      case 'HBP': HBP++; break;
      case 'SF': SF++; break;
      case 'SAC': break;
      case 'K': K++; AB++; break;
      case 'GO':
      case 'FO':
      case 'LO':
      case 'FC':
      case 'E':
      case 'DP':
      case 'INT':
        AB++; break;
    }
  }

  const GP = uniqueGames.size;

  const avg = AB > 0 ? H / AB : 0;
  const obp = (AB + BB + HBP + SF) > 0 ? (H + BB + HBP) / (AB + BB + HBP + SF) : 0;
  const slg = AB > 0 ? ((H - _2B - _3B - HR) + (2 * _2B) + (3 * _3B) + (4 * HR)) / AB : 0;
  const ops = obp + slg;

  const formatRate = (val: number) => {
    const formatted = val.toFixed(3).replace(/^0/, '');
    return formatted === '.000' && val === 0 ? '.000' : formatted;
  };

  return {
    id: playerId,
    GP,
    PA, AB, R, H, '2B': _2B, '3B': _3B, HR, RBI, BB, K,
    AVG: formatRate(avg),
    OBP: formatRate(obp),
    SLG: formatRate(slg),
    OPS: formatRate(ops)
  };
}
