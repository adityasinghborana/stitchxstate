// src/infrastructure/frontend/repositories/UserApiRepository.ts

import { UserEntity } from '@/core/entities/User.entity';
import { IUserRepository } from '@/core/repositories/IUserRepository'; // Import from the combined file
import { CreateUserDto, UpdateUserDto, userResponseDto } from '@/core/dtos/User.dto';

export class UserApiRepository implements IUserRepository {

  // Maps a UserResponseDto (from API) to UserEntity (for internal consistency)
  private mapResponseDtoToEntity(dto: userResponseDto): UserEntity {
    return new UserEntity(
      dto.id, dto.firstName, dto.lastName, dto.email,
      '', // Password is never returned by the API, so provide a placeholder
      dto.createdAt, dto.updatedAt, dto.isAdmin, dto.phone
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users from the API.');
    }
    const data: userResponseDto[] = await response.json();
    return data.map(this.mapResponseDtoToEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user by ID from the API.');
    }
    const data: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(data);
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred while creating the user.');
    }

    const data: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(data);
  }

  async update(id: string, data: Partial<UpdateUserDto>): Promise<UserEntity> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user.');
    }
    const updatedUser: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user.');
    }
  }

  // Note: This method's implementation might vary based on your API's capabilities.
  // A direct REST endpoint for findByEmail is less common than filtering a list.
  async findByEmail(email: string): Promise<UserEntity | null> {
    // This assumes your /api/users endpoint supports a query parameter for email
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to find user by email: ${email}`);
    }
    // Assuming the API returns an array of users matching the email (could be empty or contain one)
    const data: userResponseDto[] = await response.json();
    if (data.length > 0) {
      return this.mapResponseDtoToEntity(data[0]);
    }
    return null;
  }
}