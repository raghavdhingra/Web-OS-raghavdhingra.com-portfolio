import { connect, type ConnectedProps } from "react-redux";
import { assetUrl } from "../../../utils/assetUrl";
import type { RootState } from "@/store/store";
import type { AssetImport } from "@/utils/assetUrl";
import "../../../assets/desktop/desktopIcon.css";

interface DesktopIconOwnProps {
  name: string;
  icon: AssetImport;
  width: string;
  clickTask: () => void;
}

const mapStateToProps = (state: RootState) => ({
  singleClickIcon: state.desktopReducers.singleClickIcon,
});

const connector = connect(mapStateToProps);

type DesktopIconProps = DesktopIconOwnProps & ConnectedProps<typeof connector>;

const DesktopIcon = ({
  name,
  icon,
  width,
  clickTask,
  singleClickIcon,
}: DesktopIconProps) => {
  return (
    <div
      className="desktop-icon-container"
      onClick={singleClickIcon ? clickTask : () => null}
      onDoubleClick={!singleClickIcon ? clickTask : () => null}
    >
      <div className="desktop-icon">
        <img
          src={assetUrl(icon)}
          width={width}
          alt={name}
          style={{ margin: "0 auto" }}
        />
        <div className="desktop-icon-text">{name}</div>
      </div>
    </div>
  );
};

export default connector(DesktopIcon);
