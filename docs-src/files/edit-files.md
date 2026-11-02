---
id: files/edit-files
title: Read and edit files
summary: Browse the project's files and make a small edit right in the console.
screens: ["/o/*/p/*/files"]
kind: how-to
order: 10
---

# Read and edit files

The Files tab shows the project's code. The tree is on the left. The file is on the right.

![Files tab](shots/files-1.png)

## Read

- Click a folder to open it, a file to read it. Folders load as you open them.
- Type in **Filter loaded tree…** to narrow what you have opened.
- Arrow keys move through the tree. **⌘F** (or **Ctrl F**) searches the open file.
- The open file is in the address, so you can send a link to it.
- Files that are not text cannot be shown.

## Edit and save

1. Click in the file and type.
2. The header says **unsaved**.
3. Click **Save**, or press **⌘S** (**Ctrl S**).

**A save is a commit to the project's default branch.** It is not a pull request, and there is no review. Use it for small things like a typo. For bigger changes, start a [session](/docs/sessions/using-sessions/).

## If the save is refused

If someone else changed the file after you opened it, the save is refused and nothing is written. Reload the file and make your edit again.

## Who can edit

- **Members and above** can edit.
- **Viewers** can read but not change. The Save button is missing, and a note says your role can read but not change.
- **Archived repositories** are read-only.
