import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';

function Home() {
  const { keycloak, initialized } = useKeycloak();
  const [apiMessage, setApiMessage] = useState(null);
  const [error, setError] = useState(null);


  console.log('Homeレンダリング: authenticated=', keycloak.authenticated);



useEffect(() => {
  console.log('useEffect開始: initialized=', initialized, ', authenticated=', keycloak.authenticated);
  if (initialized && keycloak.authenticated) {
    console.log('トークンでAPI呼び出し開始', keycloak.token);
    fetch('http://localhost:4000/api/protected', {
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
    })
      .then(res => {
        console.log('アクセストークン:', keycloak.token);
        console.log('レスポンスステータス:', res.status);
        if (!res.ok) throw new Error('認証エラー: ' + res.status);
        return res.json();
      })
      .then(data => {
        console.log('APIレスポンス:', data);
        setApiMessage(data.message);
        setError(null);
      })
      .catch(err => {
        console.error('API呼び出しエラー:', err);
        setError(err.message);
        setApiMessage(null);
      });
  }
}, [initialized, keycloak]);

  if (!keycloak.authenticated) {
    return <button onClick={() => keycloak.login()}>ログイン</button>;
  }

  return (
    <div>
      <p>ようこそ、{keycloak.tokenParsed?.preferred_username} さん！</p>
      <button onClick={() => keycloak.logout()}>ログアウト</button>
      {apiMessage && <p>APIからのメッセージ: {apiMessage}</p>}
      {error && <p style={{ color: 'red' }}>エラー: {error}</p>}
    </div>
  );
}

function Callback() {
  const { initialized, keycloak } = useKeycloak();

  React.useEffect(() => {
    if (initialized && keycloak.authenticated) {
      window.location.href = '/';
    }
  }, [initialized, keycloak]);

  return <div>認証処理中...</div>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}
