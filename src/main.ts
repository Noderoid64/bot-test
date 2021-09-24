import {PersistenceService} from "./services/persistence.service";

const options = require('../options.json')
import {InboxBot} from "./bots/inbox-bot";

const persistence = new PersistenceService(options.connectionString);
const inboxBot = new InboxBot(persistence);

console.log('end');