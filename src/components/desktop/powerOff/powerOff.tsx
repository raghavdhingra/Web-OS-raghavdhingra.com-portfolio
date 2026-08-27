import { useEffect, useState } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { assetUrl } from "../../../utils/assetUrl";
import type { RootState } from "@/store/store";
import type { AssetImport } from "@/utils/assetUrl";
import "../../../assets/desktop/powerOff.css";

interface BackgroundItem {
  img: AssetImport;
  cover: boolean;
}

interface PowerOffOwnProps {
  backImage: BackgroundItem;
}

const PowerOff = ({
  backImage,
  powerOff,
}: PowerOffOwnProps & ConnectedProps<typeof connector>) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (powerOff.active) {
      setTimeout(() => {
        setIsActive(true);
        setTimeout(() => {
          window.close();
        }, 4000);
      }, powerOff.timer * 1000);
    }
  }, [powerOff]);

  return (
    <div
      className={`power-off-container ${isActive ? "" : "display-none"} ${
        backImage.cover ? "image-cover" : ""
      }`}
      style={{ backgroundImage: `url(${assetUrl(backImage.img)})` }}
    >
      <div className="power-off-inner-container centralise">
        <div className="power-off-loader-container">
          <div className="centralise">
            <svg height="40px" width="40px" className="loader-rotate">
              <circle className="loader-lg" />
            </svg>
          </div>
          <div className="shutdown-loader-text centralise">SHUTTING DOWN</div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  powerOff: state.desktopReducers.powerOff,
});

const connector = connect(mapStateToProps);
export default connector(PowerOff);
