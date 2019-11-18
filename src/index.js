const session = require('express-session');
const MongoStorage = require('connect-mongo');

const TIME_POINT = '>>> MongoDB session store is created in';

module.exports = parameters => {
  console.time(TIME_POINT);

  const {
    session: sessionConfigs,
    mongo: { uri: uriMongoSession },
    debug
  } = parameters;

  const Storage = MongoStorage(session);
  const store = new Storage({ url: uriMongoSession });

  const log = debug ? debug : console.info;
  const _ = key => sessionId => log(`Event '${key}', session: '${sessionId}'`);

  store
    .on('create', _('create'))
    .on('touch', _('touch'))
    .on('update', _('update'))
    .on('set', _('set'))
    .on('connect', _('connect'))
    .on('disconnect', _('disconnect'))
    .on('destroy', _('destroy'));

  const handler = session({ ...sessionConfigs, store });

  console.timeEnd(TIME_POINT);

  return handler;
};
