import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Tag } from '../entities/Tag.entity';
import { User } from '../entities/User.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const tags = dataSource.getRepository(Tag);
    await tags.insert([
      { content: '여행' },
      { content: '음식' },
      { content: '운동' },
      { content: '전자기기' },
      { content: '직업' },
    ]);
    const users = dataSource.getRepository(User);
    await users.insert([
      { firebaseUid: 'xSNgyRWyGESsdHSFQbypLtzd5X93', userType: 'admin', email: 'admin@test.com', nickname: '어드민' },
      {
        firebaseUid: 'nx1crReckzPFqKhoStKJ8L7Ba5v1',
        userType: 'user',
        email: 'user1@test.com',
        nickname: '유저1',
        tags: [tags[0], tags[1], tags[2]],
      },
      {
        firebaseUid: 'FH3rfzPpgffbLTnPVWQfwC2f6Zs1',
        userType: 'user',
        email: 'user2@test.com',
        nickname: '유저2',
        tags: [tags[2], tags[3], tags[4]],
      },
    ]);
  }
}
