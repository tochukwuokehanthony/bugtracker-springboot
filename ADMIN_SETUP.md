# Admin Account Setup Guide

This guide explains how to create and use admin accounts in the Bug Tracker application.

## What Can Admins Do?

Admin users have additional privileges compared to regular users:

1. **Assign tickets to developers** - Admins can assign any ticket to any user
2. **Unassign developers from tickets** - Admins can remove user assignments
3. **Full visibility** - Admins can see all users in the system

## Creating an Admin Account

### Method 1: Using SQL Script (Recommended)

1. First, register a regular user account through the application at `http://localhost:5173/register`

2. Connect to your PostgreSQL database:
   ```bash
   psql -U postgres -d bugtracker
   ```

3. Run the SQL command to make the user an admin:
   ```sql
   UPDATE users
   SET authority_level = 'ADMIN'
   WHERE email = 'your-email@example.com';
   ```

4. Verify the update:
   ```sql
   SELECT id, email, first_name, last_name, authority_level
   FROM users
   WHERE authority_level = 'ADMIN';
   ```

5. Log out and log back in to the application for the changes to take effect

### Method 2: Using the SQL Script File

Alternatively, you can use the provided `make-admin.sql` script:

1. Edit `make-admin.sql` and replace `'user@example.com'` with your actual email

2. Run the script:
   ```bash
   psql -U postgres -d bugtracker -f make-admin.sql
   ```

3. Log out and log back in to the application

## Using Admin Features

### Assigning Tickets to Developers

1. Navigate to any ticket details page
2. On the right sidebar, you'll see an "Assigned Developers" section
3. Click the **➕ Assign** button
4. Select a user from the dropdown
5. Click **👤 Assign User**

### Unassigning Developers

1. Navigate to the ticket details page
2. In the "Assigned Developers" section, you'll see all assigned users
3. Click the **✕** button next to a user's name to unassign them

## Checking if You're an Admin

Admin users will see additional UI elements:
- **➕ Assign** button in ticket details
- **✕** remove buttons next to assigned developers
- The ability to manage all ticket assignments

If you don't see these features after making your account an admin, try:
1. Logging out completely
2. Clearing your browser's localStorage
3. Logging back in

## Security Notes

- Admin privileges are stored in the `authority_level` column of the `users` table
- The default value for new users is `'USER'`
- Admin status is included in the JWT token and validated on every request
- Only admins can assign/unassign developers to tickets

## Troubleshooting

**Problem:** Admin features not showing after updating database

**Solution:**
- Clear browser localStorage: Open browser console and run `localStorage.clear()`
- Log out and log back in
- Make sure the email in the SQL query exactly matches your registered email

**Problem:** Cannot connect to PostgreSQL

**Solution:**
- Make sure PostgreSQL is running
- Verify your database name is `bugtracker`
- Check your PostgreSQL username and password

**Problem:** User not found in database

**Solution:**
- Make sure you've registered the account first through the application
- Check the users table: `SELECT * FROM users;`
