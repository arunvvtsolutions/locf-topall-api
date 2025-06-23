// This file provides TypeScript types for Prisma enums
declare global {
  // This is a workaround for the users_role enum in Prisma
  // It should match the enum defined in your Prisma schema
  namespace Prisma {
    type users_role = 'user' | 'admin' | 'superadmin';
  }
}

// This is needed to make the file a module
export {};
