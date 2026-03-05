'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

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

interface Props {
  params: Promise<{ userId: string }>;
}

export default function ProfilePage({ params }: Props) {
  const { userId } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [followers, setFollowers] = useState<RecentFollower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [followerLoading, setFollowerLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}/profile`)
      .then((res) => {
        if (!res.ok) throw new Error('유저를 찾을 수 없습니다.');
        return res.json();
      })
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  async function handleUsernameClick() {
    console.log('username clicked');
    if (followers) {
      console.log('followers already loaded, clearing');
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#ef4444' }}>{error || '유저를 찾을 수 없습니다.'}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div style={{ width: '320px', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <h2
          onClick={handleUsernameClick}
          style={{ fontSize: '22px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '4px' }}
        >
          {followerLoading ? '불러오는 중...' : profile.username}
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>생년월일: {profile.birthday}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{profile.followCount}</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>팔로잉</span>
          </div>
          <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>{profile.followerCount}</span>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>팔로워</span>
          </div>
        </div>

        {followers && (
          <div style={{ width: '100%', marginTop: '24px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: '#374151' }}>최근 팔로워</p>
            {followers.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center' }}>팔로워가 없습니다.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {followers.map((f) => (
                  <li key={f.followingUserId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ fontWeight: 500 }}>ID: {f.followingUserId}</span>
                    <span style={{ color: '#9ca3af' }}>{new Date(f.createdAt).toLocaleDateString('ko-KR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
