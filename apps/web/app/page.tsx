'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface UserProfile {
  username: string;
  birthday: string;
  followCount: number;
  followerCount: number;
}

interface RecentFollower {
  followingUserId: number;
  createdAt: string;
}

export default function Home() {
  const [userId, setUserId] = useState('');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<RecentFollower[] | null>(null);
  const [followerLoading, setFollowerLoading] = useState(false);
  const [myUserId, setMyUserId] = useState('');
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState('');
  const [followSuccess, setFollowSuccess] = useState(false);
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
      setFollowers(null);
      setFollowSuccess(false);
      setFollowError('');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUsernameClick() {
    console.log('username clicked, userId:', userId);
    if (followers) {
      setFollowers(null);
      return;
    }
    setFollowerLoading(true);
    try {
      const url = `http://localhost:3000/users/${userId}/followers/recent`;
      console.log('fetching:', url);
      const res = await fetch(url);
      console.log('response status:', res.status);
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const data = await res.json();
      console.log('followers data:', data);
      setFollowers(data);
    } catch (e: unknown) {
      console.error('error:', e);
      setError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setFollowerLoading(false);
    }
  }

  async function handleFollow() {
    if (!myUserId || !userId) return;
    setFollowLoading(true);
    setFollowError('');
    setFollowSuccess(false);
    try {
      const res = await fetch(`http://localhost:3000/users/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingUserId: Number(myUserId) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? '팔로우에 실패했습니다.');
      setFollowSuccess(true);
      setProfile((prev) => prev ? { ...prev, followerCount: prev.followerCount + 1 } : prev);
    } catch (e: unknown) {
      setFollowError(e instanceof Error ? e.message : '오류가 발생했습니다.');
    } finally {
      setFollowLoading(false);
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
          <h2
            className={styles.username}
            onClick={handleUsernameClick}
            style={{ cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            {followerLoading ? '불러오는 중...' : profile.username}
          </h2>
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

          <div className={styles.followBox}>
            <input
              className={styles.input}
              type="number"
              placeholder="내 User ID"
              value={myUserId}
              onChange={(e) => { setMyUserId(e.target.value); setFollowSuccess(false); }}
            />
            <button
              className={styles.button}
              onClick={handleFollow}
              disabled={followLoading || !myUserId}
            >
              {followLoading ? '처리 중...' : '팔로우'}
            </button>
          </div>
          {followSuccess && <p className={styles.followSuccess}>팔로우 완료 ✓</p>}
          {followError && <p className={styles.error}>{followError}</p>}

          {followers && (
            <div className={styles.followerList}>
              <p className={styles.followerTitle}>최근 팔로워</p>
              {followers.length === 0 ? (
                <p className={styles.followerEmpty}>팔로워가 없습니다.</p>
              ) : (
                <ul className={styles.followerItems}>
                  {followers.map((f) => (
                    <li key={f.followingUserId} className={styles.followerItem}>
                      <span>ID: {f.followingUserId}</span>
                      <span className={styles.followerDate}>{new Date(f.createdAt).toLocaleDateString('ko-KR')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
