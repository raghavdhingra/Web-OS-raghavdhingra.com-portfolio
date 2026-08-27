import { connect, type ConnectedProps } from "react-redux";
import {
  changeSingleClickIcon,
  toggleFullScreen,
} from "@/features/desktop/desktopActions";
import type { RootState } from "@/store/store";
import ToggleButton from "../../../common/ToggleButton";

const Personalise = ({
  singleClickIcon,
  changeSingleClickIcon,
  isFullScreen,
  toggleFullScreen,
}: ConnectedProps<typeof connector>) => {
  return (
    <>
      <div className="personalise-2-grid">
        <div className="personalise-text centralise">
          Desktop icons open on single click
        </div>
        <ToggleButton
          toggleAction={() => changeSingleClickIcon(!singleClickIcon)}
          toggleOn={singleClickIcon}
        />
      </div>
      <div className="personalise-2-grid">
        <div className="personalise-text centralise">Full Screen mode</div>
        <ToggleButton
          toggleAction={() => toggleFullScreen()}
          toggleOn={isFullScreen}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  singleClickIcon: state.desktopReducers.singleClickIcon,
  isFullScreen: state.desktopReducers.isFullScreen,
});

const connector = connect(mapStateToProps, {
  changeSingleClickIcon,
  toggleFullScreen,
});
export default connector(Personalise);
