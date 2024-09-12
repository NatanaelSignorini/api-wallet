import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../roles/entities/role.entity';
import { RolesEnum } from '../roles/enum/role.enum';
import { CreateUserInput } from './dto/create-user.input.dto';
import { UpdateUserInput } from './dto/update-user.input.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const roles: Role[] = [
  new Role({
    id: uuidv4(),
    name: 'Admin',
  }),
  new Role({
    id: uuidv4(),
    name: 'User',
  }),
];
const usersList: User[] = [
  new User({
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    fullName: 'John Doe',
    cpfCnpj: '123.456.789-00',
    email: 'johndoe@example.com',
    password: 'hashedPassword',
    lastLogin: new Date(),
    role: roles[0],
  }),
  new User({
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    fullName: 'Alice Smith',
    cpfCnpj: '321.654.987-00',
    email: 'alicesmith@example.com',
    password: 'hashedPassword3',
    lastLogin: new Date(),
    role: roles[1],
  }),
  new User({
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    fullName: 'Bob Johnson',
    cpfCnpj: '654.987.321-00',
    email: 'bobjohnson@example.com',
    password: 'hashedPassword4',
    lastLogin: new Date(),
    role: roles[1],
  }),
  new User({
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    fullName: 'Charlie Brown',
    cpfCnpj: '789.321.654-00',
    email: 'charliebrown@example.com',
    password: 'hashedPassword5',
    lastLogin: new Date(),
    role: roles[1],
  }),
];

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAllUsers: jest.fn().mockResolvedValue(usersList),
            getUserById: jest.fn().mockResolvedValue(usersList[1]),
            createUser: jest.fn().mockResolvedValue(usersList[1]),
            updateUser: jest.fn().mockResolvedValue(usersList[1]),
            deleteUser: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  it('should befined"', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('findAllUsers', () => {
    it('should return a Users entity successfully', async () => {
      const result = await usersController.getUsersAll();

      expect(result).toEqual(usersList);
      expect(typeof result).toEqual('object');
      expect(usersService.findAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when finding all users', async () => {
      usersService.findAllUsers.mockRejectedValue(
        new Error('Error fetching users'),
      );
      await expect(usersController.getUsersAll()).rejects.toThrow(
        'Error fetching users',
      );
    });
  });

  describe('getUserById', () => {
    it('should return a single user by id successfully', async () => {
      const userId = usersList[1].id;
      const result = await usersController.getUserById(userId);
      expect(result).toEqual(usersList[1]);
      expect(typeof result).toEqual('object');
      expect(usersService.getUserById).toHaveBeenCalledWith(userId);
      expect(usersService.getUserById).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when user not found', async () => {
      const userId = uuidv4();
      usersService.getUserById.mockRejectedValue(
        new NotFoundException('User not found'),
      );
      await expect(usersController.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserInput: CreateUserInput = {
        fullName: 'John Doe',
        cpfCnpj: '123.456.789-00',
        email: 'johndoe@example.com',
        password: 'password123',
        role: RolesEnum.USER,
      };
      const result = await usersController.createUser(createUserInput);
      expect(result).toEqual(usersList[1]);
      expect(typeof result).toEqual('object');
      expect(usersService.createUser).toHaveBeenCalledWith(createUserInput);
      expect(usersService.createUser).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when creating user', async () => {
      const createUserInput: CreateUserInput = {
        fullName: 'John Doe',
        cpfCnpj: '123.456.789-00',
        email: 'johndoe@example.com',
        password: 'password123',
        role: RolesEnum.USER,
      };
      usersService.createUser.mockRejectedValue(
        new BadRequestException('Invalid user data'),
      );
      await expect(usersController.createUser(createUserInput)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = usersList[1].id;
      const updateUserInput: UpdateUserInput = {
        id: 'userId',
        fullName: 'John Doe Updated',
        cpfCnpj: '123.456.789-00',
        email: 'johndoe.updated@example.com',
        password: 'newpassword123',
        role: RolesEnum.USER,
      };
      const result = await usersController.updateUser(userId, updateUserInput);
      expect(result).toEqual(usersList[1]);
      expect(typeof result).toEqual('object');
      expect(usersService.updateUser).toHaveBeenCalledWith(
        userId,
        updateUserInput,
      );
      expect(usersService.updateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when updating user', async () => {
      const userId = usersList[1].id;
      const updateUserInput: UpdateUserInput = {
        id: 'userId',
        fullName: 'John Doe Updated',
        cpfCnpj: '123.456.789-00',
        email: 'johndoe.updated@example.com',
        password: 'newpassword123',
        role: RolesEnum.USER,
      };
      usersService.updateUser.mockRejectedValue(
        new BadRequestException('Invalid user data'),
      );
      await expect(
        usersController.updateUser(userId, updateUserInput),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = usersList[1].id;
      const result = await usersController.deleteUser(userId);
      expect(result).toBe(true);
      expect(usersService.deleteUser).toHaveBeenCalledWith(userId);
      expect(usersService.deleteUser).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when deleting user', async () => {
      const userId = usersList[1].id;
      usersService.deleteUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );
      await expect(usersController.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
