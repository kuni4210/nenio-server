import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as DTO from './users.dto';
import axios from 'axios';
import { nickname } from '../../shared/data/nickname';
import { adminAuth } from '../../shared/firebase/firebase-admin';
import { Tag } from '../../shared/entities/Tag.entity';
import { User } from '../../shared/entities/User.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Tag) private tagRepository: Repository<Tag>, // private dataSource: DataSource,
  ) {}

  async getUserKakaoToken(kakaoToken: string): Promise<string> {
    const result = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: { Authorization: kakaoToken },
    });
    const kakaoUid = result.data.id.toString();
    const firebaseUid = await adminAuth.createCustomToken(kakaoUid, {
      provider: 'KAKAO',
    });
    return firebaseUid;
  }

  async getUserGeneralToken(generalToken: string): Promise<string> {
    const decodedToken = await adminAuth.verifyIdToken(generalToken);
    return decodedToken.uid;
  }

  async createUser(
    nickname: string,
    email: string,
    image: string,
    firebaseUid: string,
    tags: Tag[],
  ): Promise<void> {
    const user = new User();
    user.firebaseUid = firebaseUid;
    user.nickname = nickname;
    user.email = email;
    user.image = image;
    user.userType = 'user';
    user.tags = tags;
    await this.userRepository.save(user);
  }

  async updateUser(nickname: string, image: string, tags: Tag[], user: User): Promise<void> {
    user.nickname = nickname;
    user.image = image;
    user.tags = tags;
    await this.userRepository.save(user);
  }

  async deleteUser(user: User): Promise<void> {
    await adminAuth.updateUser(user.firebaseUid, { disabled: true }).then(async () => {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ deletedAt: () => 'CURRENT_TIMESTAMP' })
        .where('id = :userId', { userId: user.id })
        .execute();
    });
  }
  
  async getUser(user: User): Promise<DTO.getUserResponse | null> {
    const userWithTags = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['tags']
    });
    if (!userWithTags) {
      return null
    } else {
      const tagStrings = userWithTags.tags.map(tag => tag.content);    
      return { email: user.email, nickname: user.nickname, image: user.image, tags: tagStrings };  
    }   
  }

  //
  async checkUserNicknameDuplicate(
    body: DTO.checkUserNicknameDuplicateBody,
  ): Promise<DTO.checkUserNicknameDuplicateResponse> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.nickname = :userNickname', { userNickname: body.nickname })
      .getOne();
    return { isDuplicated: !!user };
  }

  async getUserRandomNickname(): Promise<DTO.getUserRandomNicknameResponse> {
    let randomNickname: string;
    let userExists: boolean = true;
    while (userExists) {
      randomNickname = `${nickname.adjective[Math.floor(Math.random() * nickname.adjective.length)]}${
        nickname.noun[Math.floor(Math.random() * nickname.noun.length)]
      }`;
      const user: User = await this.userRepository
        .createQueryBuilder('user')
        .where('user.deletedAt IS NULL')
        .andWhere('user.nickname = :randomNickname', { randomNickname: randomNickname })
        .getOne();
      if (!user) userExists = false;
    }
    return { nickname: randomNickname };
  }

  async getUserProfilePictureList(
    query: DTO.getUserProfilePictureListQuery,
  ): Promise<DTO.getUserProfilePictureListResponse> {
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.id IN (:...userIds)', { userIds: query.userIds })
      .getMany();
    return { images: users.map((i) => i.image) };
  }
}
