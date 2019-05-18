const sessionsMiddleware = require('@arangodb/foxx/sessions');
const jwtStorage = require('@arangodb/foxx/sessions/storages/jwt');

const jwtSessions = sessionsMiddleware({
    storage: jwtStorage({ secret: 'Secret', ttl: 60 * 60 * 24 * 7 }),
    ttl: 60 * 60 * 24 * 7, // one week in seconds
    transport: 'header',
});

module.exports = jwtSessions;
