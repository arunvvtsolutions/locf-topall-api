// This file is used to provide TypeScript type definitions for Prisma enums

// Define the users_role enum
export type UsersRole = 'user' | 'admin' | 'superadmin';

// Augment the global Prisma namespace
declare global {
  namespace Prisma {
    namespace PrismaClient {
      interface User {
        role: UsersRole;
      }
    }
  }
}
