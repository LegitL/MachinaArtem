/**
 * The interface will store all key information of the user, such as the user's username, email, user ID, 
 * profile picture, date created, and favorite styles saved.
 */
export interface UserProfile {
  id?: string;
  email?: string;
  name?: string;
  bio?: string;
  avatar?: string;
  joinedOn?: string;
  favoriteStyles?: string;
}