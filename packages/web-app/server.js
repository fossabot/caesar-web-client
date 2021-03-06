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

const APP_URI = process.env.APP_URI || 'http://localhost';
const APP_PORT = process.env.APP_PORT || 3000;

const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const next = require('next');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(cookieParser());
  server.use(
    favicon(path.join(__dirname, '/public/images/favicon', 'favicon.ico')),
  );
  server.use('/public', express.static('public'));
  server.use(
    '/service-worker.js',
    express.static(path.join(__dirname, '.next', 'service-worker.js')),
  );

  server.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.clearCookie('share');
    res.redirect('/signin');
  });

  // BE endpoint
  // eslint-disable-next-line
  server.get('/srp_login_confirm', (req, res, next) => {
    next();
  });

  server.get('/check_auth', (req, res) => {
    const token = req.query && req.query.jwt;

    if (token) {
      res.cookie('token', token, { path: '/' });
      res.redirect('/');
    } else {
      res.redirect('/signin');
    }
  });

  server.get('/resetting/:email/:token', (req, res) => {
    app.render(req, res, '/resetting', {
      email: req.params.email,
      token: req.params.token,
    });
  });

  server.get('/share/:shareId/:encryption', (req, res) => {
    app.render(req, res, '/share', {
      shareId: req.params.shareId,
      encryption: req.params.encryption,
    });
  });

  server.get('/invite/:encryption', (req, res) => {
    app.render(req, res, '/invite', {
      encryption: req.params.encryption,
    });
  });

  server.get('/message/:messageId', (req, res) => {
    app.render(req, res, '/message', {
      messageId: req.params.messageId,
    });
  });

  server.get('/', (req, res) => {
    app.render(req, res, '/');
  });

  server.get('*', (req, res) => {
    handle(req, res);
  });

  const instance = server.listen(APP_PORT, error => {
    if (error) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.log(`> Ready on ${APP_URI}:${APP_PORT}`);
  });

  process.on('SIGINT', () => {
    // eslint-disable-next-line no-console
    console.info('SIGINT signal received.');
    instance.close(err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        process.exit(1);
      }
    });
  });
});
