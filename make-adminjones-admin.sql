-- SQL Script to Make adminjones@gmail.com an Admin
-- Execute this script to grant admin privileges

-- Update the user to ADMIN
UPDATE users
SET authority_level = 'ADMIN'
WHERE email = 'adminjones@gmail.com';

-- Verify the update was successful
SELECT id, email, first_name, last_name, authority_level, created_at
FROM users
WHERE email = 'adminjones@gmail.com';

-- Show all admin users
SELECT id, email, first_name, last_name, authority_level
FROM users
WHERE authority_level = 'ADMIN';
