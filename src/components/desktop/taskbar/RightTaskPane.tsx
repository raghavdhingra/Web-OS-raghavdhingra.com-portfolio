import { useEffect } from "react";
import { connect, type ConnectedProps } from "react-redux";
import DropDown from "../dropdown/dropdown";
import {
  batteryStatus,
  onlineStatus,
  networkType,
  dropDownToggle,
  dateStatus,
} from "@/features/desktop/desktopActions";
import Wifi from "../../../assets/icons/wifi.svg";
import Battery from "../../../assets/icons/battery.svg";
import Charging from "../../../assets/icons/lighting.svg";
import DropDownCaret from "../../../assets/icons/dropdown-white.svg";
import type { RootState } from "@/store/store";

interface BatteryManager {
  level: number;
  charging: boolean;
}

interface NetworkInformation {
  effectiveType?: string;
}

interface NavigatorWithExtras extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

const RightTaskPane = ({
  battery,
  dropDownOpen,
  batteryStatus,
  onlineStatus,
  networkType,
  dateStatus,
  dropDownToggle,
}: ConnectedProps<typeof connector>) => {
  const toggleDropDown = () => {
    dropDownToggle(!dropDownOpen);
  };
  const getStatus = async () => {
    const nav = navigator as NavigatorWithExtras;
    let batteryObj: BatteryManager;
    if (nav.getBattery) batteryObj = await nav.getBattery();
    else batteryObj = { level: 1, charging: true };
    const { level, charging } = batteryObj;
    batteryStatus({ level, charging });

    onlineStatus(navigator.onLine);

    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    networkType(connection?.effectiveType || "5g");
    dateStatus(new Date());

    setTimeout(() => {
      getStatus();
    }, 5000);
  };
  useEffect(() => {
    getStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="right-task-item-container">
      <div onClick={toggleDropDown}>
        <div className="right-displayed-container">
          <div className="centralise">
            <img src={Wifi} height="17px" alt="Wifi" />
          </div>
          <div className="centralise">
            {battery && battery.charging ? (
              <img
                src={Charging}
                className="charging-icon"
                height="12px"
                alt="Charging"
              />
            ) : null}
          </div>
          <div className="centralise">
            <img src={Battery} height="17px" alt="Battery" />
          </div>
          <div className="centralise">
            <div>{battery && parseInt(String(battery.level * 100))}%</div>
          </div>
          <div className="centralise">
            <div
              className={`right-task-item ${
                dropDownOpen ? "drop-caret-up" : ""
              }`}
            >
              <img src={DropDownCaret} alt="dropdown" width="10px" />
            </div>
          </div>
        </div>
        {dropDownOpen ? (
          <div className="right-displayed-container-after"></div>
        ) : null}
      </div>
      {dropDownOpen && <DropDown />}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  battery: state.desktopReducers.battery,
  dropDownOpen: state.desktopReducers.dropDownOpen,
});

const connector = connect(mapStateToProps, {
  batteryStatus,
  networkType,
  onlineStatus,
  dropDownToggle,
  dateStatus,
});
export default connector(RightTaskPane);
