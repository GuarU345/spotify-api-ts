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

export const createUserPlaylistService = async (id: string) => {
  try {
    const getPlaylists = await prisma.playlist.findMany();
    const standardPlaylistName = `Playlist N. ${getPlaylists.length + 1}`;
    const createPlaylist = await prisma.playlist.create({
      data: {
        name: standardPlaylistName,
        release_date: new Date().toISOString(),
        user_id: id,
        image: "",
      },
    });
    return createPlaylist;
  } catch (error) {
    throw new Error("No se pudo crear la playlist");
  }
};
