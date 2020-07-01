export interface Profile {
  displayName: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
  followersCount: number;
  followingCount: number;
  photos: Photo[];
}

export interface Photo {
  id: string;
  url: string;
  isMain: boolean;
}
