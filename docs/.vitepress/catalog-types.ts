export interface GalleryIcon {
  id: string;
  name: string;
  label: string;
  component: string;
  category: string;
  kind: 'brand' | 'ui';
  folder: string;
  file?: string;
  preview: string;
  source: string;
  license: string;
}

export interface GalleryCategory {
  id: string;
  label: string;
  kind: string;
  description: string;
  folder: string;
}

export interface GalleryData {
  icons: GalleryIcon[];
  categories: GalleryCategory[];
}
