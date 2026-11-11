# Copy-Paste Templates

These blocks are **opinionated** and commonly require app-specific customization (error handling, loading state, social auth slot, branding). Copy the files you need into your app instead of importing from the core package.

## Auth (`auth/`)

| File                       | Description             |
| -------------------------- | ----------------------- |
| `sign-in-form.tsx`         | Email/password sign in  |
| `sign-up-form.tsx`         | Registration form       |
| `forgot-password-form.tsx` | Password reset request  |
| `reset-password-form.tsx`  | Set new password        |
| `verify-email-form.tsx`    | Email verification code |
| `social-connections.tsx`   | OAuth provider buttons  |
| `user-menu.tsx`            | Profile dropdown        |

## Profile (`profile/`)

| File                   | Description                           |
| ---------------------- | ------------------------------------- |
| `profile-header.tsx`   | Profile header with stats             |
| `account-card.tsx`     | Account summary card                  |
| `settings-section.tsx` | Section header                        |
| `settings-item.tsx`    | Settings row (toggle/navigate/action) |

## Usage

1. Copy the file(s) you need into your app (e.g. `src/components/auth/`).
2. Customize copy, layout, error handling, loading states as needed.
3. Wire callbacks (`onSubmit`, `onForgotPassword`, etc.) to your auth/settings logic.
4. Templates import primitives from `@thewhileloop/whileui` — no other changes needed.
