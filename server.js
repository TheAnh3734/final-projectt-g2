import express from 'express';
import helmet from 'helmet';
import http from 'http';
import exhbs from 'express-handlebars';
import logger from 'morgan';

import authRouter from './routes/auth.route.js';

const app = express();

app.engine('html', exhbs({ defaultLayout: 'default', extname: 'html' }));
app.set('views', 'views');
app.set('view engine', 'html');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(helmet());
app.use(express.static('public'));

app.use('/auth', authRouter);

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};

  // render error
  res.status(error.statusCode || 500);
  res.render('error', { error });
});

const PORT = process.env.PORT || 3000;
app.set('port', PORT);

const server = http.createServer(app);
server.listen(PORT);
// eslint-disable-next-line no-console
server.on('listening', () => console.log(`Server is listening on port ${PORT}`));
