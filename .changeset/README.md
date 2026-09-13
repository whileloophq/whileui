# Changesets

Every change to `packages/ui` that a consumer could notice gets a changeset. Twenty-two
versions shipped before this directory existed, with no record of what changed in any of
them — that is the failure this prevents.

```bash
bun run changeset          # describe what changed, pick a bump
bun run release:version    # apply pending changesets: bump version, write CHANGELOG
bun run release            # verify, build, publish
```

Write the entry for someone upgrading, not for the commit log: what changed, what they
have to do about it, and why. A `major` entry that does not say what to change at the
call site is not finished.

**This repo is public.** Changesets become the published CHANGELOG — the same rule as
commit messages applies. Describe the library; never name a consuming product.
