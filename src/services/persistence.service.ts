import {Db, MongoClient} from 'mongodb';
import {User} from "../models/user";

export class PersistenceService {
    private readonly dbName = 'gtd';
    private readonly usersCollection = 'users';
    private readonly client: MongoClient;

    public constructor(connectionString: string) {
        this.client = new MongoClient(connectionString);
    }

    public async getUser(userId: number): Promise<User> {
        return this.transaction(async (db) => {
            const users = db.collection<User>(this.usersCollection);
            return await users.findOne({
                id: userId
            });
        });
    }

    public async addInboxItem(userId: number, message: string): Promise<void> {
        return this.transaction(async (db) => {
            const users = db.collection<User>(this.usersCollection);
            await users.updateOne({
                id: userId
            }, {
                $push: {
                    inbox: {
                        text: message
                    }
                }
            });
        });
    }

    public async addUser(user: User): Promise<void> {
        return this.transaction(async (db) => {
            const users = db.collection<User>(this.usersCollection);
            await users.insertOne(user);
        });
    }

    private async transaction(callback: (x: Db) => any): Promise<any> {
        await this.client.connect();
        try {
            const db = this.client.db(this.dbName);
            return await callback(db);
        } catch (e) {
            console.error(e);
        } finally {
            await this.client.close();
        }
        return null;
    }
}