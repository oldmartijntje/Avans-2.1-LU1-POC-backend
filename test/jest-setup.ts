// Jest setup file to set environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.PORT = '3000';
