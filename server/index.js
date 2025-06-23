const express = require('express');
const cors = require('cors');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();
app.use(cors());

// Keycloakの設定
const keycloakIssuer = 'http://localhost:8080/realms/demo';

// JWT検証ミドルウェア
const checkJwt = jwt({
  // 公開鍵取得のためのJWKS URI
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `${keycloakIssuer}/protocol/openid-connect/certs`
  }),
  audience: 'account',      // Client IDを設定
  issuer: keycloakIssuer,
  algorithms: ['RS256']
});

app.get('/api/protected', checkJwt, (req, res) => {
  // トークンが検証済みならここに来る
  res.json({ message: '認証済みユーザーのみ見れます', user: req.auth });
});

app.listen(4000, () => {
  console.log('APIサーバーが http://localhost:4000 で起動中');
});
