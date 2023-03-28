import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './Auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

const fakeUsersService: Partial<UsersService> = {
  find: () => Promise.resolve([]),
  create: (email: string, password: string) =>
    Promise.resolve({ id: 1, email, password } as User),
};
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create user with salt n hash password', async () => {
    const user = await service.signup('mail@mail.com', 'password');
    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('singup throws error if email is in use', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'as@asf.dd', password: 'asdf' } as User,
      ]);

    expect(service.signup('mail@mail.com', 'password')).rejects.toThrow();
  });

  it('signin throws error if unused email', async () => {
    expect(service.signin('mail@mail.com', 'password')).rejects.toThrow();
  });

  it('signin throws error if invalid password', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'as@asf.dd', password: 'salt.hashpwd' } as User,
      ]);

    expect(service.signin('mail@mail.com', 'password')).rejects.toThrow();
  });

  it('signin successfully if correct user, password', async () => {
    const users = [];

    fakeUsersService.find = (email: string) =>
      Promise.resolve(users.filter((u) => u.email === email));
    fakeUsersService.create = (email: string, password: string) => {
      const user = { id: users.length, email, password } as User;
      users.push(user);
      return Promise.resolve(user);
    };
    await service.signup('mail@mail.com', 'password');

    const user = await service.signin('mail@mail.com', 'password');
    console.log(user);
    expect(user.email).toBe('mail@mail.com');
  });
});
