const { db } = require('@arangodb');

const users = module.context.collectionName('users');
if (!db._collection(users)) {
    db._createDocumentCollection(users);
}

module.context.collection('users').ensureIndex({
    type: 'hash',
    unique: true,
    fields: ['username'],
});
