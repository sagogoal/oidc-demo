# OpenID Connect デモ環境（React + Express + Keycloak）

このリポジトリは、**React フロントエンド（Vite）**、**Express バックエンド API**、**Keycloak 認証サーバー（Docker）**を使って、OpenID Connect (OIDC) 認証の一連の流れを体験できるデモ構成です。

---

## 🚀 起動手順

### 1. Keycloak を起動（Docker）
cd keycloak-docker
docker-compose up -d
管理画面: http://localhost:8080

初期ユーザー: admin / admin（docker-compose.yml に設定）

### 2. Express API サーバーを起動
cd ../server
npm install
node index.js
サーバー起動: http://localhost:4000

### 3. React クライアントを起動（Vite）
cd ../client
npm install
npm run dev -- --port 3000
アプリURL: http://localhost:3000

## 🔐 Keycloak 設定手順（手動）
Realm 作成
名前: demo

ユーザー作成（例）
Username: testuser

Password: 任意

クライアント作成（Reactログイン用）
項目	値
Client ID	react-client
Access Type	public
Standard Flow Enabled	✅
Valid Redirect URIs	http://localhost:3000/*
Web Origins	http://localhost:3000
Post Logout Redirect URIs	http://localhost:3000

## ✅ このデモでできること
項目	内容
ログイン	Reactアプリから Keycloak のログイン画面に遷移
アクセストークン取得	認証後、Keycloak からトークンを取得し表示
保護されたAPIの呼び出し	Express の /api/protected にトークン付きでアクセス
トークンの検証	Express 側で JWT を Keycloak の公開鍵で検証
ログアウト	Keycloak からのログアウト処理も可能

## 🔧 API（Express）構成の概要
使用ライブラリ: express, cors, express-jwt, jwks-rsa

GET /api/protected エンドポイントは JWT が必要

Keycloak の公開鍵を JWKS URI から取得して検証

audience は react-client（Client ID に合わせること）

## 🌐 主なURLまとめ
URL	内容
http://localhost:3000	Reactアプリ本体
http://localhost:4000/api/protected	認証が必要な Express API
http://localhost:8080	Keycloak管理画面
http://localhost:3000/callback	認証リダイレクト後の画面
http://localhost:8080/realms/demo/.well-known/openid-configuration	OIDCメタデータURL

## ⚠️ 注意事項
このデモでは public クライアントによる簡易構成です。本番ではセキュリティ強化のため confidential クライアント＋イントロスペクションエンドポイントの使用が推奨されます。

Keycloak の設定は Docker コンテナ削除時に失われます。必要に応じて realm のエクスポートや設定記録を残してください。

