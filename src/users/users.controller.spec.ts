import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  const fakeUsersService: Partial<UsersService> = {
    findOne: (id: number) => {
      return Promise.resolve({
        id,
        email: 'sf@asd.com',
        password: 'adf',
      } as User);
    },
    find: (email: string) => {
      return Promise.resolve([{ id: 1, email, password: 'adf' } as User]);
    },
    // remove: () => {},
    // update: () => {},
  };
  const fakeAuthService: Partial<AuthService> = {
    // signup: () => {},
    signin: (email: string, password: string) => {
      return Promise.resolve({ id: 1, email, password } as User);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findallusers return list of users', async () => {
    const users = await controller.findAllUsers('mail@mail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('mail@mail.com');
  });

  it('findUser return a user if exist', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('findUser throw error user if not exist', async () => {
    fakeUsersService.findOne = () => {
      return Promise.resolve(null);
    };
    expect(controller.findUser('1')).rejects.toThrow();
  });

  it('signIn updates session object n return user', async () => {
    const session = { userId: null };
    const user = await controller.signin(
      { email: 'asf@asdf.cc', password: 'asfdf' },
      session,
    );
    expect(session.userId).toEqual(user.id);
  });
});
