import { UserModel, type UserDocument } from "@/models/user/schemas/user.schema";

export class UserRepository {
  static async findByEmailHash(emailHash: string): Promise<UserDocument | null> {
    return UserModel.findOne({ emailHash });
  }

  static async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  static async create(data: Record<string, unknown>): Promise<UserDocument> {
    return UserModel.create(data);
  }

  static async save(user: UserDocument): Promise<UserDocument> {
    return user.save();
  }
}
