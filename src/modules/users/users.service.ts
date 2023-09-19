import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as RequestDTO from './dto/users-request.dto';
import * as ResponseDTO from './dto/users-response.dto';
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

  async createUser(body: RequestDTO.joinUserBody, firebaseUid: string): Promise<void> {
    const user = new User();
    user.firebaseUid = firebaseUid;
    user.nickname = body.nickname;
    user.email = body.email;
    user.image = body.image;
    user.userType = 'user';

    if (body.tags?.length < 3) throw new BadRequestException('tag/length-must-be-at-least-3');
    else {
      const tags: Tag[] = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.content IN (:...tagContents)', { tagContents: body.tags })
        .getMany();
      user.tags = tags;
    }
    await this.userRepository.save(user);
    // await this.userRepository.createQueryBuilder().insert().into(User).values(user).execute();
  }

  async updateUser(body: RequestDTO.updateUserBody, user: User): Promise<void> {
    if (body.nickname !== null) {
      user.nickname = body.nickname;
    }
    if (body.image !== null) {
      user.image = body.image;
    }
    if (body.tags !== null) {
      if (body.tags.length < 3) throw new BadRequestException('tag/length-must-be-at-least-3');
      else {
        const tags: Tag[] = await this.tagRepository
          .createQueryBuilder('tag')
          .where('tag.content IN (:...tagContents)', { tagContents: body.tags })
          .getMany();
        user.tags = tags;
      }
    }
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

  async getUser(user: User): Promise<ResponseDTO.getUser> {
    const tagStrings = user.tags.map((tag) => tag.toString());
    return { email: user.email, nickname: user.nickname, image: user.image, tags: tagStrings };
  }

  async checkUserNicknameDuplicate(
    body: RequestDTO.checkUserNicknameDuplicateBody,
  ): Promise<ResponseDTO.checkUserNicknameDuplicate> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.nickname = :userNickname', { userNickname: body.nickname })
      .getOne();
    return { isDuplicated: !!user };
  }

  async getUserRandomNickname(): Promise<ResponseDTO.getUserRandomNickname> {
    let randomNickname: string;
    let userExists: boolean = true;
    while (userExists) {
      randomNickname = `${nickname.adjective[Math.floor(Math.random() * nickname.adjective.length)]} ${
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
    query: RequestDTO.getUserProfilePictureListQuery,
  ): Promise<ResponseDTO.getUserProfilePictureList> {
    const users: User[] = await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere('user.id IN (:...userIds)', { userIds: query.userIds })
      .getMany();
    return { images: users.map((i) => i.image) };
  }
}
