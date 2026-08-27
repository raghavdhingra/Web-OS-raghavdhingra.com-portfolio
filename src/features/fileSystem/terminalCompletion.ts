import type { FileSystemEntry } from "@/types/models";
import { findDirectoryByPath } from "./fileSystemUtils";

const ARG_COMMANDS = new Set(["open", "cd", "rm"]);

export interface ParsedTerminalInput {
  commandPartial: string;
  argPartial: string | null;
}

export function parseTerminalInput(line: string): ParsedTerminalInput {
  const trimmed = line.replace(/^\s+/, "").replace(/\s+/g, " ");
  const spaceIndex = trimmed.indexOf(" ");

  if (spaceIndex === -1) {
    return { commandPartial: trimmed, argPartial: null };
  }

  return {
    commandPartial: trimmed.slice(0, spaceIndex),
    argPartial: trimmed.slice(spaceIndex + 1),
  };
}

export function commonPrefix(values: string[]): string {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];

  let prefix = values[0];
  for (const value of values.slice(1)) {
    while (
      prefix.length > 0 &&
      !value.toLowerCase().startsWith(prefix.toLowerCase())
    ) {
      prefix = prefix.slice(0, -1);
    }
  }

  return prefix;
}

function getCurrentDirectoryEntries(
  fileSystem: FileSystemEntry[],
  inputPath: string
): FileSystemEntry[] {
  const path = inputPath.split("/").filter(Boolean).join("/");
  return findDirectoryByPath(fileSystem, path) ?? [];
}

function getArgumentCandidates(
  command: string,
  entries: FileSystemEntry[]
): string[] {
  if (command === "cd" || command === "rm") {
    return entries
      .filter((entry) => entry.type === "folder")
      .map((entry) => entry.name);
  }

  if (command === "open") {
    return entries
      .filter((entry) => entry.type === "file")
      .map((entry) => entry.name);
  }

  return [];
}

export interface TabCompletionResult {
  completedLine: string | null;
  matches: string[];
}

export function getTabCompletion(
  line: string,
  commands: string[],
  fileSystem: FileSystemEntry[],
  inputPath: string
): TabCompletionResult {
  const { commandPartial, argPartial } = parseTerminalInput(line);

  if (argPartial === null) {
    const partial = commandPartial.toLowerCase();
    const matches = commands.filter((name) => name.startsWith(partial));

    if (matches.length === 0) {
      return { completedLine: null, matches: [] };
    }

    if (matches.length === 1) {
      return { completedLine: `${matches[0]} `, matches };
    }

    const prefix = commonPrefix(matches);
    if (prefix.length > commandPartial.length) {
      return { completedLine: prefix, matches };
    }

    return { completedLine: null, matches };
  }

  const command = commandPartial.toLowerCase();
  if (!ARG_COMMANDS.has(command)) {
    return { completedLine: null, matches: [] };
  }

  const entries = getCurrentDirectoryEntries(fileSystem, inputPath);
  const candidates = getArgumentCandidates(command, entries);
  const partial = argPartial.toLowerCase();
  const matches = candidates.filter((name) =>
    name.toLowerCase().startsWith(partial)
  );

  if (matches.length === 0) {
    return { completedLine: null, matches: [] };
  }

  if (matches.length === 1) {
    return { completedLine: `${command} ${matches[0]}`, matches };
  }

  const prefix = commonPrefix(matches);
  if (prefix.length > argPartial.length) {
    return { completedLine: `${command} ${prefix}`, matches };
  }

  return { completedLine: null, matches };
}

export function getCompletionSuggestion(
  line: string,
  commands: string[],
  fileSystem: FileSystemEntry[],
  inputPath: string
): string {
  const { completedLine, matches } = getTabCompletion(
    line,
    commands,
    fileSystem,
    inputPath
  );

  if (completedLine && completedLine.length > line.length) {
    return completedLine.slice(line.length);
  }

  if (matches.length !== 1) return "";

  const { commandPartial, argPartial } = parseTerminalInput(line);

  if (argPartial === null) {
    const match = matches[0];
    if (!match.toLowerCase().startsWith(commandPartial.toLowerCase())) return "";
    const remainder = match.slice(commandPartial.length);
    return remainder ? `${remainder} ` : "";
  }

  const match = matches[0];
  if (!match.toLowerCase().startsWith(argPartial.toLowerCase())) return "";
  return match.slice(argPartial.length);
}

export function setEditableText(element: HTMLSpanElement, text: string) {
  element.innerText = text;

  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}
