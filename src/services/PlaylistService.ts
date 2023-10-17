import { prisma } from "../utils/prisma";

export const getUserPlaylistsService = async (id) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: {
        user_id: id,
      },
    });
    if (playlists.length === 0) {
      throw new Error("No se encontraron playlists de ese usuario");
    }
    return playlists;
  } catch (error) {
    throw error;
  }
};

export const getSongsByPlaylistIdService = async (id: string) => {
  //get specific playlist
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!playlist) {
    throw new Error("No se pudo encontrar la playlist");
  }

  //get info with playlist id
  const playlistData = await prisma.playlistSong.findMany({
    where: {
      playlist_id: playlist.id,
    },
  });

  if (playlistData.length === 0) {
    throw new Error("Playlist vacia");
  }

  //get song ids saved in this playlist
  const songIds = playlistData.map((playlistSong) => playlistSong.song_id);

  //search songs by id iterating the song ids
  const songsInfo = await prisma.song.findMany({
    where: {
      id: {
        in: songIds,
      },
    },
    include: {
      artist: true,
      album: true,
    },
  });

  const playlistSongs = {
    playlist: playlist.name,
    playlistDescription: playlist.description,
    playlistImg: playlist.image,
    songs: songsInfo.map((playlistSong) => {
      return {
        songName: playlistSong.name,
        artistName: playlistSong.artist?.name,
        albumName: playlistSong.album.name,
        albumImage: playlistSong.album.album_image,
      };
    }),
  };
  return playlistSongs;
};

export const createUserPlaylistService = async (id: string) => {
  try {
    const getPlaylists = await prisma.playlist.findMany();
    const standardPlaylistName = `Playlist N. ${getPlaylists.length + 1}`;
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: standardPlaylistName,
        release_date: new Date().toISOString(),
        user_id: id,
        image: "not image",
      },
    });
    return createPlaylist;
  } catch (error) {
    throw new Error("No se pudo crear la playlist");
  }
};

export const updatePlaylistService = async (id: string, body) => {
  try {
    const { name, description, image } = body;
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!playlist) {
      throw new Error("No se pudo encontrar la playlist");
    }
    const updatePlaylist = await prisma.playlist.update({
      data: {
        name,
        description,
        image,
      },
      where: {
        id: playlist.id,
      },
    });
    return updatePlaylist;
  } catch (error) {
    throw error;
  }
};

export const addSongToPlaylistService = async (
  playlistId: string,
  songId: string
) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(playlistId),
      },
    });
    if (!playlist) {
      throw new Error("No se pudo encontrar la playlist");
    }
    const song = await prisma.song.findUnique({
      where: {
        id: Number(songId),
      },
    });
    if (!song) {
      throw new Error("No se pudo encontrar la cancion");
    }
    const addSong = await prisma.playlistSong.create({
      data: {
        playlist_id: playlist.id,
        song_id: song.id,
      },
    });
    return addSong;
  } catch (error) {
    throw error;
  }
};

export const countSongsByPlaylistService = async (id) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        PlaylistSongs: true,
      },
    });
    if (!playlist) {
      throw new Error("No se pudo encontrar la playlist");
    }
    return {
      count: playlist.PlaylistSongs.length,
    };
  } catch (error) {
    throw error;
  }
};
