# Security Specification & Threat Model

## 1. Data Invariants & Authorization Boundaries
1. **Public Read Isolation**: Unauthenticated and standard users may ONLY read:
   - Projects where `resource.data.published == true`
   - Technical skills in `/skills/{skillId}`
   - Learning journey items in `/learning_journey/{journeyId}`
   - Certifications in `/certifications/{certId}`
   - Public settings in `/settings/profile`
2. **Draft Privacy**: Projects where `published != true` (or drafts) must NEVER be returned or readable by unauthenticated users or standard users. Only verified administrators may view drafts.
3. **Write Protection**: Only authenticated, verified administrators whose email matches the designated admin (`beingcrazyff@gmail.com`) or exists in `/admins/$(request.auth.uid)` may create, update, or delete portfolio content.
4. **ID Poisoning Defense**: Document path parameters must be strictly bounded string identifiers matching alphanumeric characters, hyphens, or underscores (`isValidId`).
5. **No Client Role Escalation**: The `/admins` collection can only be written by existing verified admins; no anonymous or arbitrary user can write to `/admins/{uid}` or make themselves an admin.
6. **Volumetric & Schema Boundary**: All incoming strings must have strict `.size() <= max` constraints to prevent denial-of-wallet and storage exhaustion.

## 2. The "Dirty Dozen" Threat Payloads
1. **Anonymous Project Creation**: Unauthenticated POST to `/projects/hack1` -> PERMISSION_DENIED.
2. **Unpublished Project Snooping**: Unauthenticated GET to `/projects/private-draft` where `published == false` -> PERMISSION_DENIED.
3. **Public Project Tampering**: Unauthenticated UPDATE to `/projects/project-1` changing title or links -> PERMISSION_DENIED.
4. **Self-Promotion to Admin**: Non-admin authenticated user attempts write to `/admins/{their_uid}` with `role: "admin"` -> PERMISSION_DENIED.
5. **Unverified Email Spoofing**: User with unverified email matching admin attempting to write to `/projects` -> PERMISSION_DENIED.
6. **Denial-of-Wallet Payload**: Admin-targeted attempt to upload 500KB text into title (`title.size() > 150`) -> PERMISSION_DENIED.
7. **Ghost Field Injection**: Attempt to create project with unexpected shadow properties (`shadowProperty: true`) -> PERMISSION_DENIED.
8. **Malicious ID Poisoning**: Attempt to create document with 2000-character junk path ID -> PERMISSION_DENIED.
9. **Direct Deletion of Skills**: Anonymous DELETE on `/skills/python` -> PERMISSION_DENIED.
10. **Direct Deletion of Timeline**: Standard user DELETE on `/learning_journey/journey-1` -> PERMISSION_DENIED.
11. **Settings Overwrite**: Anonymous write to `/settings/profile` replacing contact information with spam -> PERMISSION_DENIED.
12. **Array Expansion Attack**: Attempt to save 1,000 tags in `tools` array -> PERMISSION_DENIED (enforce `.size() <= 20`).
