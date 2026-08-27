export type AssetImport = string | { src: string; default?: AssetImport };

export function assetUrl(asset: AssetImport | null | undefined): string {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  if (typeof asset === "object" && "src" in asset) return asset.src;
  if (typeof asset === "object" && asset !== null && "default" in asset) {
    const nested = (asset as { default?: AssetImport }).default;
    if (nested) return assetUrl(nested);
  }
  return String(asset);
}
