import Dexie, { Table } from 'dexie';
import { UserProfile, CompletedSession, FtpTestHistoryItem } from '../../types/user';

export class BikeTrainerDatabase extends Dexie {
  public profiles!: Table<UserProfile, string>;
  public completedSessions!: Table<CompletedSession, number>;
  public ftpHistory!: Table<FtpTestHistoryItem, number>;

  constructor() {
    super('DomyosBikeTrainerDB');
    this.version(1).stores({
      profiles: 'id',
      completedSessions: '++id, sessionId, workoutId, startedAt, category',
      ftpHistory: '++id, date',
    });
  }
}

export const db = new BikeTrainerDatabase();
