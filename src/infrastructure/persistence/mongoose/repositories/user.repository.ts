import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { IUserRepository } from '../../../../domain/repositories/user-repository.interface';
import { User as UserEntity } from '../../../../domain/entities/user.entity';
import { User as UserModel } from '../models/user.model';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>
    ) { }

    async findAll(role?: string): Promise<UserEntity[]> {
        const filter = role ? { role } : {};
        const models = await this.userModel.find(filter).exec();
        return UserMapper.toDomainArray(models);
    }

    async findById(uuid: string): Promise<UserEntity> {
        const model = await this.userModel
            .findOne({ uuid })
            .exec();

        if (!model) {
            throw new NotFoundException('User Not Found');
        }

        const user = UserMapper.toDomain(model);
        if (!user) {
            throw new NotFoundException('User Not Found');
        }
        return user;
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        const model = await this.userModel.findOne({ username }).exec();
        if (!model) {
            throw new NotFoundException('User Not Found');
        }
        return UserMapper.toDomain(model);
    }

    async findByUsernameForAuth(username: string): Promise<UserEntity | null> {
        const model = await this.userModel.findOne({ username }).exec();
        if (!model) {
            throw new NotFoundException('User Not Found');
        }
        return UserMapper.toDomain(model);
    }

    async create(user: UserEntity, password: string): Promise<UserEntity> {
        // Check duplicates
        const existingUsername = await this.userModel.findOne({
            username: user.username
        }).exec();
        if (existingUsername) {
            throw new ConflictException('Username already taken');
        }

        const existingEmail = await this.userModel.findOne({
            email: user.email
        }).exec();
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create model
        const persistenceData = UserMapper.toPersistence(user);
        const newUser = new this.userModel({
            ...persistenceData,
            uuid: uuidv4(),
            password: hashedPassword
        });

        const saved = await newUser.save();
        const savedUser = UserMapper.toDomain(saved);
        if (!savedUser) {
            throw new Error('Failed to create user');
        }
        return savedUser;
    }

    async update(uuid: string, data: Partial<UserEntity>): Promise<UserEntity> {
        const existing = await this.userModel.findOne({ uuid }).exec();
        if (!existing) {
            throw new NotFoundException('User Not Found');
        }

        const updateData: any = {};
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        if (data.studyId !== undefined) updateData.study = data.studyId;
        if (data.favouriteIds) updateData.favourites = data.favouriteIds;

        const updated = await this.userModel
            .findOneAndUpdate({ uuid }, updateData, { new: true })
            .exec();

        if (!updated) {
            throw new NotFoundException('User Not Found');
        }

        const user = UserMapper.toDomain(updated);
        if (!user) {
            throw new NotFoundException('User Not Found');
        }
        return user;
    }

    async delete(uuid: string): Promise<boolean> {
        const result = await this.userModel.deleteOne({ uuid }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException('User Not Found');
        }
        return true;
    }

    async existsByUsername(username: string): Promise<boolean> {
        const count = await this.userModel.countDocuments({ username }).exec();
        return count > 0;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const count = await this.userModel.countDocuments({ email }).exec();
        return count > 0;
    }

    async addFavourite(uuid: string, subjectId: string): Promise<any> {
        const user = await this.userModel.findOne({ uuid }).exec();
        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        if (!user.favourites.includes(subjectId as any)) {
            user.favourites.push(subjectId as any);
            await user.save();
        }

        // Return raw Mongoose document for API compatibility
        return user;
    }

    async removeFavourite(uuid: string, subjectId: string): Promise<any> {
        const user = await this.userModel.findOne({ uuid }).exec();
        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        user.favourites = user.favourites.filter(
            (fav) => fav.toString() !== subjectId
        );
        await user.save();

        // Return raw Mongoose document for API compatibility
        return user;
    }

    async getFavouriteIds(uuid: string): Promise<string[]> {
        const user = await this.userModel.findOne({ uuid }).exec();
        if (!user) {
            throw new NotFoundException('User Not Found');
        }

        return user.favourites.map(fav => fav.toString());
    }
}
