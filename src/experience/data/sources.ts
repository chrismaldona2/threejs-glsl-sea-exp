type SupportedTypes = "gltf" | "texture";

export type Source = {
  name: string;
  type: SupportedTypes;
  path: string;
};

const sources: Source[] = [
  {
    name: "foamTexture1",
    type: "texture",
    path: "./textures/foam-texture-1.webp",
  },
  {
    name: "foamTexture2",
    type: "texture",
    path: "./textures/foam-texture-2.webp",
  },
];

export default sources;
