'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface UserProfile {
  username: string;
  birthday: string;
  followCount: number;
  followerCount: number;
}

export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!userId) return;
    setLoading(true);
    setError('');
    setProfile(null);

    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/profile`);
      if (!res.ok) throw new Error('유저를 찾을 수 없습니다.');
      const data = await res.json();
      setProfile(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>유저 프로필 조회</h1>

      <div className={styles.searchBox}>
        <input
          className={styles.input}
          type="number"
          placeholder="User ID 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className={styles.button} onClick={handleSearch} disabled={loading}>
          {loading ? '조회 중...' : '조회'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {profile && (
        <div className={styles.card}>
          <h2 className={styles.username}>{profile.username}</h2>
          <p className={styles.birthday}>생년월일: {profile.birthday}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.followCount}</span>
              <span className={styles.statLabel}>팔로잉</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>{profile.followerCount}</span>
              <span className={styles.statLabel}>팔로워</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
