import React, { useEffect, useState, useRef } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { removeActivity, createActivity } from "@/features/activity/activityActions";
import { resetToDefault } from "@/features/desktop/desktopActions";
import {
  makeDirectoryAction,
  removeDirectoryAction,
} from "@/features/fileSystem/fileSystemActions";
import { findDirectoryByPath } from "@/features/fileSystem/fileSystemUtils";
import {
  openEntryMessage,
  openFileSystemEntry,
} from "@/features/fileSystem/openEntry";
import {
  getCompletionSuggestion,
  getTabCompletion,
  setEditableText,
} from "@/features/fileSystem/terminalCompletion";
import type { RootState } from "@/store/store";
import type { ActivitySupplement, FileSystemEntry } from "@/types/models";
import "../../../assets/applications/terminal.css";

interface OutputDivisionProps {
  inputPath?: string;
  command?: string;
  error?: React.ReactNode;
  success?: React.ReactNode;
  startState?: boolean;
}

const OutputDivision = ({
  inputPath,
  command,
  error,
  success,
  startState,
}: OutputDivisionProps) => {
  if (startState)
    return (
      <>
        <div className="terminal-main-content terminal-blue">
          Welcome to Web OS
        </div>
        <div className="terminal-output">
          Type &quot;help&quot; for all the commands
        </div>
      </>
    );

  return (
    <div className="terminal-main-content">
      <span className="terminal-green">raghavdhingra@web-os: </span>
      <span className="terminal-blue">{inputPath}$ </span>
      <span className="terminal-text-editor">{command}</span>
      {error && <div className="terminal-output terminal-red">{error}</div>}
      {success && <div className="terminal-output">{success}</div>}
    </div>
  );
};

interface CommandHandlerArgs {
  command: string;
  tokens: string[];
  isSudo: boolean;
  inputPath?: string;
}

interface CommandDefinition {
  invoke: string;
  onActive: (args: CommandHandlerArgs) => void;
  description: string;
}

interface TerminalOwnProps {
  supplement: ActivitySupplement;
}

const getDirectoryChildren = (
  entries: FileSystemEntry[],
  path: string
): FileSystemEntry[] | null => findDirectoryByPath(entries, path);

const TerminalWindow = ({
  fileSystem,
  activityList,
  removeActivity,
  createActivity,
  makeDirectoryAction,
  removeDirectoryAction,
  resetToDefault,
  supplement: { terminalLocation },
}: TerminalOwnProps & ConnectedProps<typeof connector>) => {
  const [inputPath, setInputPath] = useState(() =>
    terminalLocation?.length ? `/${terminalLocation.join("/")}/` : "/"
  );
  const [historyCommands, setHistoryCommand] = useState(["help"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [commandOutput, setCommandOutput] = useState<React.ReactNode[]>([
    <OutputDivision key="terminal-start" startState={true} />,
  ]);
  const [inputLine, setInputLine] = useState("");
  const TextRef = useRef<HTMLSpanElement>(null);

  const printOutput = ({
    inputPath: path,
    command,
    error,
    success,
    startState,
  }: OutputDivisionProps) => {
    const outputCommand = (
      <OutputDivision
        inputPath={path}
        command={command}
        success={success}
        error={error}
        startState={startState}
      />
    );
    setCommandOutput((prev) => [...prev, outputCommand]);
  };

  const emptyTextRef = () => {
    setTimeout(() => {
      if (TextRef.current) TextRef.current.innerText = "";
      setInputLine("");
    }, 10);
  };

  const clearScreen = () =>
    setCommandOutput([
      <OutputDivision key="terminal-start" startState={true} />,
    ]);

  const echoOnScreen = ({ command, tokens, isSudo }: CommandHandlerArgs) => {
    if (isSudo) tokens.shift();
    tokens.shift();
    return printOutput({ inputPath, command, success: tokens.join(" ") });
  };
  const setInputPathConditionally = (pathArr: string[]) => {
    const filtered = pathArr.filter((system) => !!system);
    if (filtered.length) setInputPath(`/${filtered.join("/")}/`);
    else setInputPath("/");
  };
  const changeDirectory = ({ command, tokens, isSudo }: CommandHandlerArgs) => {
    if (isSudo) tokens.shift();
    try {
      if (tokens.length > 2) {
        return printOutput({
          inputPath,
          command,
          error: `"cd" command can't have more than 1 parameter`,
        });
      } else {
        if (tokens[1] === "/") {
          setInputPath("/");
          return printOutput({ inputPath, command });
        }
        const fullPath = inputPath.split("/").filter((path) => !!path);
        const givenDirList = tokens[1].split("/").filter((path) => !!path);
        for (const segment of givenDirList) {
          if (segment === ".") break;
          else if (segment === "..") {
            if (fullPath.length) fullPath.pop();
            else
              return printOutput({
                inputPath,
                command,
                error: "Already on the base directory",
              });
          } else fullPath.push(segment);
        }
        const curDir = getDirectoryChildren(fileSystem, fullPath.join("/"));
        if (!curDir) {
          return printOutput({
            inputPath,
            command,
            error: "No such directory exists",
          });
        }
        setInputPathConditionally(fullPath);
        return printOutput({ inputPath, command });
      }
    } catch {
      printOutput({ inputPath, command, error: "Please specify a folder" });
    }
  };
  const exitTerminal = ({ command, tokens }: CommandHandlerArgs) => {
    if (tokens.length > 1) {
      return printOutput({
        inputPath,
        command,
        error: `"exit" command can't have more than 1 parameter`,
      });
    }
    const activityIndex = activityList.findIndex(
      (activity) => activity.name === "Terminal"
    );
    removeActivity(activityIndex);
  };
  const HelpTerminal = ({ command }: CommandHandlerArgs) => {
    const childParameter = (
      <div className="terminal-help-grid">
        {commandList.map((com, index) => (
          <React.Fragment key={`command-list-${index}`}>
            <div>{com.invoke}</div>
            <div>-</div>
            <div>{com.description}</div>
          </React.Fragment>
        ))}
      </div>
    );
    return printOutput({ inputPath, command, success: childParameter });
  };
  const listInDirectory = ({ command }: CommandHandlerArgs) => {
    const currentDir = getDirectoryChildren(
      fileSystem,
      inputPath.split("/").filter(Boolean).join("/")
    );
    if (!currentDir) {
      return printOutput({
        inputPath,
        command,
        error: "No such directory exists",
      });
    }
    const childParameter = (
      <div className="terminal-file-system-grid">
        {currentDir.map((system, index) => (
          <React.Fragment key={`file-system-${index}`}>
            <div className={system.type === "folder" ? "terminal-blue" : ""}>
              {system.name}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
    return printOutput({ inputPath, command, success: childParameter });
  };
  const pwdCommand = ({ command }: CommandHandlerArgs) =>
    printOutput({ inputPath, command, success: inputPath });

  const makeDirectory = ({ command, tokens, isSudo }: CommandHandlerArgs) => {
    if (isSudo) tokens.shift();
    if (tokens.length > 2)
      return printOutput({
        inputPath,
        command,
        error: "Folder name should not have space between them",
      });
    else if (tokens.length === 1)
      return printOutput({
        inputPath,
        command,
        error: "Please specify a folder name",
      });
    else {
      const pathArr = inputPath.split("/").filter((path) => !!path);
      const curDir = getDirectoryChildren(fileSystem, pathArr.join("/"));
      if (!curDir) {
        return printOutput({
          inputPath,
          command,
          error: "No such directory exists",
        });
      }
      const newFolderName = tokens[1];
      const index = curDir.filter(
        (system) => system.type === "folder" && system.name === newFolderName
      );
      if (index.length > 0)
        return printOutput({
          inputPath,
          command,
          error: "Folder with same name exist",
        });
      makeDirectoryAction({ pathArray: pathArr, folderName: newFolderName });
      printOutput({ inputPath, command });
    }
  };
  const removeDirectory = ({ command, tokens, isSudo }: CommandHandlerArgs) => {
    if (isSudo) {
      tokens.shift();
    }
    if (tokens.length > 2) {
      return printOutput({
        inputPath,
        command,
        error: "Folder name should not have space between them",
      });
    } else if (tokens.length === 1) {
      return printOutput({
        inputPath,
        command,
        error: "Please specify a folder name",
      });
    } else {
      const pathArr = inputPath.split("/").filter((path) => !!path);
      const curDir = getDirectoryChildren(fileSystem, pathArr.join("/"));
      if (!curDir) {
        return printOutput({
          inputPath,
          command,
          error: "No such directory exists",
        });
      }
      const newFolderName = tokens[1];
      const index = curDir.filter(
        (system) => system.type === "folder" && system.name === newFolderName
      );
      if (index.length === 0)
        return printOutput({
          inputPath,
          command,
          error: "Folder with the given name does not exist",
        });
      removeDirectoryAction({ pathArray: pathArr, folderName: newFolderName });
      printOutput({ inputPath, command });
    }
  };
  const resetCommand = ({ command }: CommandHandlerArgs) => {
    printOutput({
      inputPath,
      command,
      success: "System settings and file system have been reset",
    });
    resetToDefault();
  };

  const openEntry = ({ command, tokens, isSudo }: CommandHandlerArgs) => {
    if (isSudo) tokens.shift();
    if (tokens.length < 2) {
      return printOutput({
        inputPath,
        command,
        error: "Please specify a file or app name",
      });
    }

    const name = tokens.slice(1).join(" ");
    const currentDir = getDirectoryChildren(
      fileSystem,
      inputPath.split("/").filter(Boolean).join("/")
    );

    if (!currentDir) {
      return printOutput({
        inputPath,
        command,
        error: "No such directory exists",
      });
    }

    const entry = currentDir.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );

    if (!entry) {
      return printOutput({
        inputPath,
        command,
        error: `No such file or app: "${name}"`,
      });
    }

    if (entry.type === "folder") {
      return printOutput({
        inputPath,
        command,
        error: `"${entry.name}" is a folder. Use "cd" to enter it.`,
      });
    }

    const result = openFileSystemEntry(entry, createActivity);
    return printOutput({
      inputPath,
      command,
      success: openEntryMessage(entry.name, result),
    });
  };

  const commandList: CommandDefinition[] = [
    {
      invoke: "help",
      onActive: HelpTerminal,
      description:
        "Return the list of commands that you can run on terminal | No parameter",
    },
    {
      invoke: "ls",
      onActive: listInDirectory,
      description:
        "Return the list of all files and folder in current or specified directory | One parameter (optional)",
    },
    {
      invoke: "open",
      onActive: openEntry,
      description:
        'Open a file or app in the current directory | One parameter (required), e.g. open Portfolio',
    },
    {
      invoke: "clear",
      onActive: clearScreen,
      description: "Clears the terminal | No parameters",
    },
    {
      invoke: "echo",
      onActive: echoOnScreen,
      description: "Prints the word or the line on the terminal",
    },
    {
      invoke: "cd",
      onActive: changeDirectory,
      description:
        "Change the directory of the terminal | One parameter (required)",
    },
    {
      invoke: "mkdir",
      onActive: makeDirectory,
      description:
        "Make a directory within current folder | One parameter (required)",
    },
    {
      invoke: "rm",
      onActive: removeDirectory,
      description:
        "Remove a directory within current folder | One parameter (required)",
    },
    {
      invoke: "pwd",
      onActive: pwdCommand,
      description: "Returns the working directory of the terminal",
    },
    {
      invoke: "reset",
      onActive: resetCommand,
      description: "Resets everything (settings and file system)",
    },
    {
      invoke: "exit",
      onActive: exitTerminal,
      description: "Exits the terminal | No parameters",
    },
  ];

  const terminalCommands = commandList.map((command) => command.invoke);
  const suggestionSuffix = getCompletionSuggestion(
    inputLine,
    terminalCommands,
    fileSystem,
    inputPath
  );

  const syncInputLine = () =>
    setInputLine(TextRef.current?.innerText ?? "");

  const focusTextRef = () => TextRef.current?.focus();

  const handleTabCompletion = () => {
    if (!TextRef.current) return;

    const line = TextRef.current.innerText ?? "";
    const { completedLine, matches } = getTabCompletion(
      line,
      terminalCommands,
      fileSystem,
      inputPath
    );

    if (completedLine !== null) {
      setEditableText(TextRef.current, completedLine);
      setInputLine(completedLine);
      return;
    }

    if (matches.length > 1) {
      printOutput({
        inputPath,
        command: line,
        success: (
          <div className="terminal-file-system-grid">
            {matches.map((match) => (
              <div key={match}>{match}</div>
            ))}
          </div>
        ),
      });
    }
  };

  const keyPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "Enter") {
      setHistoryIndex(0);
      const command = TextRef.current?.innerText ?? "";
      setHistoryCommand([...historyCommands, command]);
      const tokens = command.trim().replace(/\s\s+/g, " ").split(" ");
      const isSudo = tokens[0] === "sudo";
      if (!isSudo) {
        const commandObj = commandList.find(
          (com) => com.invoke === tokens[0].toLowerCase()
        );
        if (commandObj) commandObj.onActive({ command, tokens, isSudo });
        else
          printOutput({
            inputPath,
            command,
            error: `Error: "${tokens[0]}" is not a command`,
          });
      }
      emptyTextRef();
    } else if (e.key === "ArrowUp") {
      const lastIndex = historyCommands.length - 1;
      if (historyIndex === lastIndex) setHistoryIndex(lastIndex);
      else setHistoryIndex(historyIndex + 1);
      if (TextRef.current) {
        const historyLine = historyCommands[lastIndex - historyIndex];
        TextRef.current.innerText = historyLine;
        setInputLine(historyLine);
      }
    } else if (e.key === "ArrowDown") {
      const lastIndex = historyCommands.length - 1;
      if (historyIndex === 0) setHistoryIndex(0);
      else setHistoryIndex(historyIndex - 1);
      if (TextRef.current) {
        const historyLine = historyCommands[lastIndex - historyIndex];
        TextRef.current.innerText = historyLine;
        setInputLine(historyLine);
      }
    }
  };
  useEffect(() => {
    focusTextRef();
  }, []);

  return (
    <>
      <div className="terminal-editable-container" onClick={focusTextRef}>
        <div>
          {commandOutput.map((OutputComp, index) => (
            <React.Fragment key={`output-division-${index}`}>
              {OutputComp}
            </React.Fragment>
          ))}
        </div>
        <div className="terminal-main-content">
          <span className="terminal-green">raghavdhingra@web-os: </span>
          <span className="terminal-blue">{inputPath}$ </span>
          <span
            className="terminal-input-wrap"
            title={suggestionSuffix ? "Press Tab to autocomplete" : undefined}
          >
            <span className="terminal-input-ghost" aria-hidden="true">
              {inputLine}
              {suggestionSuffix ? (
                <span className="terminal-input-suggestion">
                  {suggestionSuffix}
                </span>
              ) : null}
            </span>
            <span
              contentEditable={true}
              suppressContentEditableWarning={true}
              className="terminal-text-editor"
              ref={TextRef}
              onInput={syncInputLine}
              onKeyDown={keyPress}
            ></span>
            {suggestionSuffix ? (
              <span className="terminal-tab-hint">Press Tab to autocomplete</span>
            ) : null}
          </span>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  fileSystem: state.fileSystemReducers.fileSystem,
  activityList: state.activityReducers.activity,
});

const connector = connect(mapStateToProps, {
  removeActivity,
  createActivity,
  makeDirectoryAction,
  removeDirectoryAction,
  resetToDefault,
});
export default connector(TerminalWindow);
