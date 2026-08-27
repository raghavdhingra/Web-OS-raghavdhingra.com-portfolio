import type { AssetImport } from "@/utils/assetUrl";
import Back1 from "@/assets/background/wall-1.svg";
import Back2 from "@/assets/background/wall-2.svg";
import Back3 from "@/assets/background/wall-3.svg";
import Back4 from "@/assets/background/wall-4.svg";
import Back5 from "@/assets/background/wall-5.svg";
import Back6 from "@/assets/background/wall-6.svg";

export interface Wallpaper {
  name: string;
  img: AssetImport;
  cover: boolean;
}

export const WALLPAPERS: Wallpaper[] = [
  { name: "Eternal", img: Back1, cover: true },
  { name: "Temporal", img: Back2, cover: true },
  { name: "Speck", img: Back3, cover: false },
  { name: "Chime", img: Back4, cover: true },
  { name: "Karma", img: Back5, cover: true },
  { name: "Plates", img: Back6, cover: false },
];
