/**
 * The interface will store all key information of the styles, such as the title, the image, 
 * the author, the privacy and other characteristics.
 */

export interface Style {
  id?: string;  // If public, this will be Style collection document id
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
