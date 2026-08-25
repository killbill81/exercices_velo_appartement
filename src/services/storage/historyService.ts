import { db } from './db';
import { UserProfile, CompletedSession, FtpTestHistoryItem } from '../../types/user';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'default-user',
  name: 'Cycliste',
  ftpWatts: 150,
  maxHeartRateBpm: 185,
  restingHeartRateBpm: 60,
  weightKg: 70,
  soundAlertsEnabled: true,
  voiceCoachEnabled: true,
  screenWakeLockEnabled: true,
  updatedAt: new Date().toISOString(),
};

class HistoryService {
  /**
   * Récupère le profil utilisateur (ou crée le profil par défaut)
   */
  public async getUserProfile(): Promise<UserProfile> {
    try {
      const profile = await db.profiles.get('default-user');
      if (profile) return profile;
      await db.profiles.put(DEFAULT_USER_PROFILE);
      return DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  }

  /**
   * Met à jour le profil utilisateur
   */
  public async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await db.profiles.put(updated);
    return updated;
  }

  /**
   * Enregistre une séance terminée
   */
  public async saveSession(session: CompletedSession): Promise<number> {
    return await db.completedSessions.add(session);
  }

  /**
   * Récupère toutes les séances passées triées par date
   */
  public async getAllSessions(): Promise<CompletedSession[]> {
    return await db.completedSessions.reverse().sortBy('startedAt');
  }

  /**
   * Enregistre un nouveau test FTP et met à jour le profil
   */
  public async saveFtpTestResult(
    previousFtp: number, 
    newFtp: number, 
    peakMinuteWatts: number, 
    maxHr: number, 
    durationSeconds: number
  ): Promise<void> {
    const item: FtpTestHistoryItem = {
      date: new Date().toISOString(),
      previousFtpWatts: previousFtp,
      newFtpWatts: newFtp,
      peakMinutePowerWatts: peakMinuteWatts,
      maxHeartRateBpm: maxHr,
      testDurationSeconds: durationSeconds,
    };
    await db.ftpHistory.add(item);
    await this.updateUserProfile({ ftpWatts: newFtp });
  }

  /**
   * Récupère l'historique des tests FTP
   */
  public async getFtpHistory(): Promise<FtpTestHistoryItem[]> {
    return await db.ftpHistory.reverse().sortBy('date');
  }

  /**
   * Exporte une séance au format TCX (Training Center XML) standard
   * Compatible Strava, Garmin, TrainingPeaks
   */
  public generateTcxFile(session: CompletedSession): string {
    const startTime = session.startedAt || new Date().toISOString();
    
    let trackpointsXml = '';
    session.samples.forEach((s) => {
      const pointTime = new Date(s.timestampMs).toISOString();
      trackpointsXml += `
        <Trackpoint>
          <Time>${pointTime}</Time>
          <DistanceMeters>${(s.speedKmh * s.elapsedSeconds / 3.6).toFixed(1)}</DistanceMeters>
          <HeartRateBpm>
            <Value>${s.heartRateBpm > 0 ? s.heartRateBpm : 100}</Value>
          </HeartRateBpm>
          <Cadence>${s.cadenceRpm}</Cadence>
          <Extensions>
            <TPX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
              <Watts>${s.powerWatts}</Watts>
              <Speed>${(s.speedKmh / 3.6).toFixed(2)}</Speed>
            </TPX>
          </Extensions>
        </Trackpoint>`;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd">
  <Activities>
    <Activity Sport="Biking">
      <Id>${startTime}</Id>
      <Lap StartTime="${startTime}">
        <TotalTimeSeconds>${session.durationSeconds}</TotalTimeSeconds>
        <DistanceMeters>${Math.round(session.totalDistanceKm * 1000)}</DistanceMeters>
        <MaximumSpeed>${(session.maxSpeedKmh / 3.6).toFixed(2)}</MaximumSpeed>
        <Calories>${session.totalCaloriesKcal}</Calories>
        <AverageHeartRateBpm>
          <Value>${session.avgHeartRateBpm}</Value>
        </AverageHeartRateBpm>
        <MaximumHeartRateBpm>
          <Value>${session.maxHeartRateBpm}</Value>
        </MaximumHeartRateBpm>
        <Intensity>Active</Intensity>
        <Cadence>${session.avgCadenceRpm}</Cadence>
        <TriggerMethod>Manual</TriggerMethod>
        <Track>
          ${trackpointsXml}
        </Track>
        <Extensions>
          <LX xmlns="http://www.garmin.com/xmlschemas/ActivityExtension/v2">
            <AvgWatts>${session.avgPowerWatts}</AvgWatts>
            <MaxWatts>${session.maxPowerWatts}</MaxWatts>
          </LX>
        </Extensions>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;
  }

  /**
   * Déclenche le téléchargement du fichier TCX dans le navigateur
   */
  public downloadTcx(session: CompletedSession) {
    const xml = this.generateTcxFile(session);
    const blob = new Blob([xml], { type: 'application/vnd.garmin.tcx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-velo-${session.startedAt.split('T')[0]}-${session.workoutId}.tcx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const historyService = new HistoryService();
