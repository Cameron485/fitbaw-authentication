const joi = require('joi');
const createRouter = require('@arangodb/foxx/router');

const auth = require('../utils/auth');

const router = createRouter();

const users = module.context.collection('users');

router.post('/signup', (req, res) => {
    const user = req.body;

    try {
        // Create an authentication hash
        user.authData = auth.create(user.password);

        // Delete plain password data
        delete user.password;
        delete user.password_confirmation;

        // Validate user (for demo purpose)
        user.a = true;
        const meta = users.save(user);
        Object.assign(user, meta); // assign _key, _id to user
    } catch (e) {
        res.throw('bad request', 'Username already taken', e);
    }
    // Set the session uid
    req.session.uid = user._key;
    res.send({ success: true });
}).body(joi.object({
    fn: joi.string().required(),
    ln: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().min(8).max(32).required(),
    passwordConfirmation: joi.string().required(),
}), 'Credentials').description('Creates a new user and logs them in.');

router.post('/login', (req, res) => {
    // This may return a user object or null
    const user = users.firstExample({
        username: req.body.username,
        a: true,
    });
    const valid = auth.verify(
        user ? user.authData : {},
        req.body.password
    );
    // Log the user in
    if (valid) {
        req.session.uid = user._key;
    }
    // Corrs
    res.setHeader('Access-Control-Expose-Headers', 'X-Session-Id');
    res.send({ success: valid, uid: req.session });
}).body(joi.object({
    username: joi.string().required(),
    password: joi.string().required(),
}).required(), 'Credentials').description('Logs a registered user in.');

router.post('/logout', (req, res) => {
    if (req.session.uid) {
        req.session.uid = null;
    }
    res.send({ success: true });
})
    .description('Logs the current user out.');

module.exports = router;
