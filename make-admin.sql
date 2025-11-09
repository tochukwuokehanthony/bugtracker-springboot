-- SQL Script to Make a User an Admin
--
-- This script updates a user's authority_level to 'ADMIN'
-- Replace 'user@example.com' with the actual email address of the user you want to make an admin

-- Option 1: Make a user admin by email
UPDATE users
SET authority_level = 'ADMIN'
WHERE email = 'user@example.com';

-- Option 2: Make a user admin by user ID
-- UPDATE users
-- SET authority_level = 'ADMIN'
-- WHERE id = 1;

-- Verify the update
SELECT id, email, first_name, last_name, authority_level
FROM users
WHERE authority_level = 'ADMIN';
