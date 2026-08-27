import { useMemo } from "react";
import { connect, type ConnectedProps } from "react-redux";
import { changeFontStyle } from "@/features/desktop/desktopActions";
import type { RootState } from "@/store/store";

const FontChanger = ({
  changeFontStyle,
  font,
}: ConnectedProps<typeof connector>) => {
  const fontStyleArray = useMemo(
    () => [
      { name: "Roboto", className: "font-roboto" },
      { name: "Potta One", className: "font-potta" },
      { name: "Raleway", className: "font-raleway" },
      { name: "Lobster", className: "font-lobster" },
      { name: "Times", className: "font-times" },
      { name: "Courier", className: "font-courier" },
    ],
    []
  );
  return (
    <>
      <div className="theme-change-container">
        {fontStyleArray.map((fontStyle, index) => (
          <div
            className={`theme-change-division ${
              font - 1 === index ? "theme-change-division-active" : ""
            } ${fontStyle.className}`}
            key={`theme-${index}`}
            onClick={() => changeFontStyle(index + 1)}
          >
            <div className="theme-change-background centralise">Aa</div>
            <div className="theme-change-name">{fontStyle.name}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  font: state.desktopReducers.fontStyle,
});

const connector = connect(mapStateToProps, { changeFontStyle });
export default connector(FontChanger);
