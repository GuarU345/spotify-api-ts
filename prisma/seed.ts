import { prisma } from "../src/utils/prisma";
import { ALBUMS, ARTISTS, SONGS } from "../src/utils/initial-data";

const main = async () => {
  try {
    const resp = await createNewArtists();
    console.log(resp);
  } catch (error) {
    console.error(error);
  }
  try {
    const resp = await createNewAlbums();
    console.log(resp);
  } catch (error) {
    console.error(error);
  }
  setTimeout(async () => {
    const resp = await createNewSongs();
    console.log(resp);
  }, 5000);
};

const createNewArtists = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const createArtists = ARTISTS.map(async (artist) => {
        await prisma.artist.create({
          data: {
            name: artist.name,
            nationality: artist.nationality,
          },
        });
      });
      await Promise.all(createArtists);
      resolve("Artistas creados correctamente");
    } catch (error) {
      console.error(error);
      reject("Hubo un error");
    }
  });
};

const createNewAlbums = () => {
  return new Promise(async (resolve, reject) => {
    try {
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
      resolve("Albums creados correctamente");
    } catch (error) {
      console.error(error);
      reject("Hubo un error");
    }
  });
};

const createNewSongs = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const albums = await prisma.album.findMany({
        include: {
          artist: true,
        },
      });

      const albumData = albums.flatMap((album) => {
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

      const createSongs = albumData.map((album) => {
        album?.songs.map(async (song) => {
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
      resolve("canciones creadas correctamente");
    } catch (error) {
      reject("Hubo un error");
    }
  });
};

main();
