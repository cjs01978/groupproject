import mongoose, { Schema, model, models, Model } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = (models?.User as Model<IUser>) || model<IUser>('User', userSchema);
export default User;

