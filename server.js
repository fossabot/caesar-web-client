const envFile = `.env.${
  process.env.NODE_ENV !== 'production' ? 'development' : 'production'
}`;

if (require('fs').existsSync(envFile)) {
  require('dotenv').config({
    path: `.env.${
      process.env.NODE_ENV !== 'production' ? 'development' : 'production'
    }`,
  });
}

if (!process.env.APP_HOST || !process.env.APP_PORT) {
  throw new Error('You must specify environment variables!');
}

const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const atob = require('atob');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const port = process.env.APP_PORT;
const handle = app.getRequestHandler();

const jwtParse = token => {
  if (!token) return null;

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  try {
    return JSON.parse(atob(base64));
  } catch (ex) {
    return null;
  }
};

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(cookieParser());
  server.use(express.static('static'));
  server.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth');
  });

  server.get('/check_auth', (req, res) => {
    const token = req.query && req.query.jwt;
    const parsedToken = jwtParse(token);
    if (token) {
      const path = parsedToken['2fa'] ? '/2fa?isCheck=true' : '/';
      res.cookie('token', token, { path: '/' });
      res.redirect(path);
    } else {
      res.redirect('/auth');
    }
  });

  server.get('/', (req, res) => {
    app.render(req, res, '/');
  });

  server.get('*', (req, res) => {
    handle(req, res);
  });

  const instance = server.listen(port, error => {
    if (error) {
      throw error;
    }

    console.log(
      `> Ready on ${process.env.APP_PROTOCOL}://${process.env.APP_HOST}:${
        process.env.APP_PORT
      }`,
    );
  });

  process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    instance.close(err => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
});
