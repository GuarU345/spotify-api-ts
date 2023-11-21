import { Buffer } from "buffer";

export interface Album {
  name: string;
  release_date: string;
}

export interface SongBody {
  name: string;
  duration: string;
  track?: Buffer;
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

export interface Song {
  id: number;
}
