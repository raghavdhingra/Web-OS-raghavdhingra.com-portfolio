import type { FileSystemEntry } from "@/types/models";

/** Resolve a folder path to its immediate children. Returns [] when the path is invalid. */
export function findDirectory(
  fileSystem: FileSystemEntry[],
  pathArray: string[]
): FileSystemEntry[] {
  let current = fileSystem;

  for (const segment of pathArray) {
    const folder = current.find((entry) => entry.name === segment);
    if (!folder || !Array.isArray(folder.child)) return [];
    current = folder.child;
  }

  return current;
}

/** Resolve a slash-separated path (e.g. `/desktop/docs`). Returns null when invalid. */
export function findDirectoryByPath(
  fileSystem: FileSystemEntry[],
  path: string
): FileSystemEntry[] | null {
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return fileSystem;

  let current = fileSystem;
  for (const segment of segments) {
    const folder = current.find(
      (entry) => entry.name === segment && entry.type === "folder"
    );
    if (!folder || !Array.isArray(folder.child)) return null;
    current = folder.child;
  }

  return current;
}

export function getFileContent(
  fileSystem: FileSystemEntry[],
  location: string[],
  fileName: string
): string {
  const file = findDirectory(fileSystem, location).find(
    (entry) => entry.name === fileName
  );
  return typeof file?.child === "string" ? file.child : "";
}
