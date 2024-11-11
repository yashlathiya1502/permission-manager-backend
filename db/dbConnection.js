import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('Connected to mongoDb');
  } catch (error) {
    console.log(error);F
    process.exit(1);
  }
};

export default connectDB;
