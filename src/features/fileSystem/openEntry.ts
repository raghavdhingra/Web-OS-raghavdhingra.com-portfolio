import FOLDER_IMAGE from "@/assets/icons/folder.svg";
import FILE_IMAGE from "@/assets/icons/file.svg";
import { CONTENT_TYPES } from "@/features/activity/buildActivity";
import type { FileSystemEntry, SpawnActivityInput } from "@/types/models";
import { assetUrl, type AssetImport } from "@/utils/assetUrl";

export type CreateActivityHandler = (input: SpawnActivityInput) => void;

export function resolveEntryIcon(entry: FileSystemEntry): AssetImport {
  if (entry.icon) return entry.icon;
  return entry.type === "folder" ? FOLDER_IMAGE : FILE_IMAGE;
}

export type OpenEntryResult = "opened" | "external" | "unsupported";

/** Opens a file-system entry the same way as double-clicking a desktop icon. */
export function openFileSystemEntry(
  entry: FileSystemEntry,
  createActivity: CreateActivityHandler
): OpenEntryResult {
  if (entry.type !== "file") return "unsupported";

  if (entry.link) {
    if (entry.inPage) {
      createActivity({
        name: entry.name,
        contentType: CONTENT_TYPES.IFRAME,
        image: assetUrl(resolveEntryIcon(entry)),
        link: entry.link,
      });
      return "opened";
    }

    window.open(entry.link);
    return "external";
  }

  createActivity({
    name: entry.name,
    contentType: CONTENT_TYPES.TEXT_EDITOR,
    image: assetUrl(resolveEntryIcon(entry)),
    system: entry,
  });
  return "opened";
}

export function openEntryMessage(name: string, result: OpenEntryResult): string {
  if (result === "external") return `Opened "${name}" in a new tab`;
  if (result === "opened") return `Opened "${name}"`;
  return `"${name}" cannot be opened`;
}
