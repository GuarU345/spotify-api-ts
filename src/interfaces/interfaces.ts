export interface Album {
  name: string;
  release_date: string;
  album_image: string;
}

export interface SongBody {
  name: string;
  duration: string;
  track?: string;
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
  id: string;
}

export interface AlbumSong {
  id: string;
  name: string;
  duration: string | null;
  artist_id: string;
  album_id: string;
  track: string | null;
}

interface AlbumToPlaylist {
  id: string;
  name: string;
  release_date: Date;
  album_image: string | null;
  artist_id: string;
  color_id: string | null;
}

interface ArtistToPlaylist {
  id: string;
  name: string;
  nationality: string;
}

export interface PlaylistSong {
  id: string;
  name: string;
  duration: string | null;
  artist_id: string;
  album_id: string;
  track: string | null;
  artist: ArtistToPlaylist | null;
  album: AlbumToPlaylist;
}

export interface SongUserStateBody {
  user_id: string,
  song_id: string,
  minute: string,
  album_id: string
} 
