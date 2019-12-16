export interface FavoriteStyle {
  slug?: string;
  title?: string;
  image: string;
  description?: string;
  isPublic: boolean;
  isWikiart: boolean;
  date: string;
  author?: {
    id?: string
    name?: string;
    bio?: string;
  };
}
