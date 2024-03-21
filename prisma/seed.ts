import { prisma } from "../src/utils/prisma";
import { ALBUMS, ARTISTS, SONGS } from "../src/utils/initial-data";

const main = async () => {
  try {
    await createNewArtists();
    await createNewAlbums();
    await createNewSongs();

    console.log("Finalizo correctamente");
  } catch (error) {
    console.error(error);
  }
};

const createNewArtists = async () => {
  const createArtists = ARTISTS.map(async ({ name, nationality }) => {
    await prisma.artist.create({
      data: {
        name,
        nationality
      }
    });
  })

  await Promise.all(createArtists)

  console.log("Artistas creados correctamente")
};

const createNewAlbums = async () => {
  const createAlbums = ALBUMS.map(async (album) => {
    const findSpecificArtist = await prisma.artist.findFirst({
      where: {
        name: album.artist,
      },
    });

    await prisma.album.create({
      data: {
        name: album.name,
        release_date: album.release_date,
        album_image: album.album_image,
        artist_id: findSpecificArtist?.id!,
      },
    });
  });

  await Promise.all(createAlbums);

  console.log("Albums creados correctamente")
};

const createNewSongs = async () => {
  const albums = await prisma.album.findMany({
    include: {
      artist: true,
    },
  });

  const albumData = albums.flatMap((album: any) => {
    return SONGS.map((song) => {
      if (song.album === album.name) {
        return {
          albumId: album.id,
          artistId: album.artist.id,
          name: album.name,
          songs: song.songs,
        };
      }
    }).filter(Boolean);
  });

  const createSongs = albumData.map((album: any) => {
    album?.songs.map(async (song: any) => {
      await prisma.song.create({
        data: {
          name: song.name,
          album_id: album.albumId,
          artist_id: album.artistId,
          duration: song.duration,
        },
      });
    });
  });

  await Promise.all(createSongs);

  console.log("canciones creadas correctamente")
};

main();