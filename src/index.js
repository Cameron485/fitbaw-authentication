const jwtSessions = require('./utils/jwtSessions');

const users = module.context.collection('users');

module.context.use('/auth', require('./routes/auth'));

module.context.use(jwtSessions);

module.context.use((req, res, next) => {
    if (req.session.uid) {
        try {
            req.user = users.document(req.session.uid);
        } catch (e) {
            req.session.uid = null;
            req.jwtSessions.save();
        }
    }
    next();
});
