import { connect, type ConnectedProps } from "react-redux";
import { changeBackImage } from "@/features/desktop/desktopActions";
import { WALLPAPERS } from "@/data/wallpapers";
import { assetUrl } from "@/utils/assetUrl";
import type { RootState } from "@/store/store";

const ThemeChanger = ({
  background,
  changeBackImage,
}: ConnectedProps<typeof connector>) => {
  return (
    <>
      <div className="theme-change-container">
        {WALLPAPERS.map((theme, index) => (
          <div
            className={`theme-change-division ${
              background - 1 === index ? "theme-change-division-active" : ""
            }`}
            key={theme.name}
            onClick={() => changeBackImage(index + 1)}
          >
            <div
              className={`theme-change-background ${
                theme.cover ? "image-cover" : ""
              }`}
              style={{
                backgroundImage: `url(${assetUrl(theme.img)})`,
              }}
            ></div>
            <div className="theme-change-name">{theme.name}</div>
          </div>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  background: state.desktopReducers.background,
});

const connector = connect(mapStateToProps, { changeBackImage });
export default connector(ThemeChanger);
