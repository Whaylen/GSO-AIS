# eGov Template

> Templates simplify the creation of documents. Templates can ease our workload and make us feel less stressed, and, at the same time, they increase efficiency. Templates increase the attention of the audience. They help in saving time and money.
>
> -- <cite>www.google.com</cite>

## Main Modules

> Sample modules, please adjust based on your project

- User Management ![progress](https://progress-bar.dev/90/)
- Roles Management ![progress](https://progress-bar.dev/100/)
- Permissions Management (ADMIN ONLY) ![progress](https://progress-bar.dev/10/)

## Features

> Sample Features, please adjust based on your project

### User Management

- [x] Create account
- [x] Update Profile
  - [x] Update Name (First Name, Middle Name, Last Name, Suffix, Nickname)
  - [x] Update Birthdate
  - [x] Update Profile Pic
    - Image Upload
    - Select From existing images
  - [x] Update Gender
  - [x] Update Addresses
- [x] Update Account credentials
  - [x] Update Username
  - [x] Update Email
  - [x] Update Password
  - [ ] Update Roles & Permissions

### Roles Management

- [x] Create Roles
- [x] Update Roles
- [x] Assign Role Permissions
- [x] Delete Roles

### Permissiosn Management

- [x] Lock access to Super Admin Only
- [ ] Create Permision
- [ ] Update Permission
- [ ] Delete Permission

#

### Note!

- You can open the workspace file (`workspace.code-workspace`) with vscode

### Semantic Commits

When committing, use semantic commits with the format `<type> (<module>) <icon> : <subject>`

**WHERE**

- `<type>` - refers to one of the types listed below.
- `<module>` - refers to frontend, backend, integration, cicd, etc...
- `<subject>` - present tense action (add, update, remove) + summary

**TYPES**

- feat :sparkles: (new feature for the user, not a new feature for build script)
- fix :bug: (bug fix for the user, not a fix to a build script)
- docs :memo: document: (changes to the documentation)
- style :gem: (formatting, missing semi colons, etc; no production code change)
- refactor :recycle: (refactoring production code, eg. renaming a variable)
- test :test_tube: (adding missing tests, refactoring tests; no production code change)
- chore :briefcase: (updating grunt tasks etc; no production code change)
