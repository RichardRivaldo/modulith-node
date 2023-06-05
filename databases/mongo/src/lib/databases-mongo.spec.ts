import { MongoHelper } from './databases-mongo';

describe('databasesMongo', () => {
    it('should work', () => {
        expect(new MongoHelper()).toEqual('MongoHelper created!');
    });
});
