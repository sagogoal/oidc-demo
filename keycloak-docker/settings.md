# Keycloak 設定手順メモ

Dockerを事前に立ち上げる
このフォルダで、docker-compose up -d でコンテナ起動

## 1. Keycloak 管理画面にアクセス

- URL: `http://localhost:8080/admin/master/console/`
- 初回ログイン時は管理者アカウントでログイン admin admin

---

## 2. Realm の作成

1. 左上の「Realm: master」をクリック
2. 「Create Realm」を選択
3. Realm Name に `demo-realm`（任意の名前）を入力
4. 「Create」ボタンをクリック

---

## 3. クライアントの作成（React アプリ用）

1. 左メニュー「Clients」→「Create client」
2. 設定項目を入力：

| 項目            | 設定値                  |
| --------------- | ----------------------- |
| Client ID       | `react-client`          |
| Client Protocol | `openid-connect`        |


3. 「Save」をクリック

4. 続いてクライアント詳細設定で以下を設定：

| 項目                            | 設定値                     |
| ------------------------------- | ------------------------- |
| Access Type                     | `public`                  |
| Standard Flow Enabled           | チェックあり（有効）        |
| Valid Redirect URIs             | `http://localhost:3000/*` |
| Web Origins                     | `http://localhost:3000`   |
| Valid Post Logout Redirect URIs | `http://localhost:3000/*` |
| Root URL                        | `http://localhost:3000`   |

5. 設定を保存する

---

## 4. ユーザーの作成（テスト用）

1. 左メニュー「Users」→「Add user」
2. ユーザー名に `testuser` と入力し「Save」
3. 「Credentials」タブを選択
4. パスワードを入力（例: `password`）
5. 「Temporary」チェックを外し「Set Password」をクリック

---

## 5. 注意事項

- 設定は Keycloak コンテナのデータベースに保存されるため、
  - コンテナを削除すると設定も消える
- 永続化する場合は、`docker-compose.yml` にボリュームマウント設定を追加すること

---

## 6. docker-compose での永続化例

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:24.0
    command: start-dev
    ports:
      - "8080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    volumes:
      - keycloak-data:/opt/keycloak/data

volumes:
  keycloak-data:
```
