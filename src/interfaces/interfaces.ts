export interface Album {
  name: string;
  release_date: string;
}

export interface Song {
  name: string;
  duration: string;
}

export interface Artist {
  name: string;
  nationality: string;
}

export interface Playlist {
  name?: string;
  description?: string;
  image?: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
}
