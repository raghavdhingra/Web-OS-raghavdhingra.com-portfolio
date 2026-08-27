import "../../assets/common/toggleButton.css";

interface ToggleButtonProps {
  toggleOn: boolean;
  toggleAction: () => void;
}

const ToggleButton = ({ toggleOn, toggleAction }: ToggleButtonProps) => {
  return (
    <div
      className={`toggle-button-container ${
        toggleOn ? "toggle-button-container-active" : ""
      }`}
      onClick={toggleAction}
    >
      <div
        className={`toggle-button ${toggleOn ? "toggle-button-active" : ""}`}
      ></div>
    </div>
  );
};

export default ToggleButton;
