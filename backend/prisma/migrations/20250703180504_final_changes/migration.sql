/*
  Warnings:

  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "github_link" TEXT,
ADD COLUMN     "linkedin_link" TEXT,
ADD COLUMN     "twitter_link" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL;
