export interface Style {
  id?: string;  // If public, this wil be Style collection document id
  slug?: string;
  title?: string;
  image: string;
  description?: string;
  isPublic: boolean;
  isWikiart: boolean;
  date: string;
  author?: {
    id?: string;  // If user created, it will be User collection document id
    name?: string;
    bio?: string;
    avatar?: string;
  };
}
