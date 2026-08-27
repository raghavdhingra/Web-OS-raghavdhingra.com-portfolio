import { useRef } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { changeTextInFile } from "@/features/fileSystem/fileSystemActions";
import { getFileContent } from "@/features/fileSystem/fileSystemUtils";
import type { RootState } from "@/store/store";
import type { FileSystemEntry } from "@/types/models";
import "@/assets/applications/textEditor.css";

interface TextEditorOwnProps {
  system: FileSystemEntry;
}

const TextEditor = ({
  system,
  fileSystem,
  changeTextInFile,
}: TextEditorOwnProps & ConnectedProps<typeof connector>) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const text = getFileContent(
    fileSystem.fileSystem,
    system.location,
    system.name
  );

  const changeText = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    changeTextInFile({
      pathArray: system.location,
      name: system.name,
      child: e.target.value,
    });

  return (
    <div className="text-editor-container">
      <textarea
        ref={textAreaRef}
        autoFocus
        defaultValue={text}
        onChange={changeText}
        className="text-editor-area"
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  fileSystem: state.fileSystemReducers,
});

const connector = connect(mapStateToProps, { changeTextInFile });
export default connector(TextEditor);
