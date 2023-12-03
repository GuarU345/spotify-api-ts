import { prisma } from "../src/utils/prisma";

const ARTISTS = [
  {
    name: "Imagine Dragons",
    nationality: "American",
  },
  {
    name: "Post Malone",
    nationality: "American",
  },
  {
    name: "The Weeknd",
    nationality: "American",
  },
  {
    name: "Kendrick Lamar",
    nationality: "American",
  },
  {
    name: "Junior H",
    nationality: "Mexican",
  },
];

const ALBUMS = [
  {
    name: "Smoke + Mirrors",
    release_date: "1970-01-01T00:00:00.000Z",
    album_image:
      "https://i.scdn.co/image/ab67616d00001e021551c93dfa33ea4f30ef4eea",
    artist: "Imagine Dragons",
  },
  {
    name: "Beerbongs & Bentleys",
    release_date: "1970-01-01T00:00:00.000Z",
    album_image:
      "https://i.scdn.co/image/ab67616d00001e02b1c4b76e23414c9f20242268",
    artist: "Post Malone",
  },
  {
    name: "After Hours",
    release_date: "1970-01-01T00:00:00.000Z",
    album_image:
      "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
    artist: "The Weeknd",
  },
  {
    name: "DAMN",
    release_date: "1970-01-01T00:00:00.000Z",
    album_image:
      "https://i.scdn.co/image/ab67616d00001e028b52c6b9bc4e43d873869699",
    artist: "Kendrick Lamar",
  },
  {
    name: "$AD BOYZ 4 LIFE II",
    release_date: "1970-01-01T00:00:00.000Z",
    album_image:
      "https://i.scdn.co/image/ab67616d00001e02f3ba6742a35f111aaea1ca2f",
    artist: "Junior H",
  },
];

const SONGS = [
  {
    artist: "Imagine Dragons",
    album: "Smoke + Mirrors",
    songs: [
      {
        name: "Gold",
        duration: "3:06",
      },
      {
        name: "Shots",
        duration: "4:05",
      },
      {
        name: "Hopeless Opus",
        duration: "5:25",
      },
      {
        name: "Dream",
        duration: "4:06",
      },
      {
        name: "Who We Are",
        duration: "3:30",
      },
    ],
  },
  {
    artist: "Post Malone",
    album: "Beerbongs & Bentleys",
    songs: [
      {
        name: "Stay",
        duration: "3:06",
      },
      {
        name: "Over Now",
        duration: "4:05",
      },
      {
        name: "rockstar",
        duration: "5:25",
      },
      {
        name: "Psycho",
        duration: "4:06",
      },
      {
        name: "Better Now",
        duration: "3:30",
      },
    ],
  },
  {
    artist: "The Weeknd",
    album: "After Hours",
    songs: [
      {
        name: "In Your Eyes",
        duration: "3:06",
      },
      {
        name: "Save Your Tears",
        duration: "4:05",
      },
      {
        name: "Blinding Lights",
        duration: "5:25",
      },
      {
        name: "Faith",
        duration: "4:06",
      },
      {
        name: "Heartless",
        duration: "3:30",
      },
    ],
  },
  {
    artist: "Kendrick Lamar",
    album: "DAMN",
    songs: [
      {
        name: "BLOOD",
        duration: "3:06",
      },
      {
        name: "DNA",
        duration: "4:05",
      },
      {
        name: "ELEMENT",
        duration: "5:25",
      },
      {
        name: "FEEL",
        duration: "4:06",
      },
      {
        name: "DUCKWORTH",
        duration: "3:30",
      },
    ],
  },
  {
    artist: "Junior H",
    album: "$AD BOYZ 4 LIFE II",
    songs: [
      {
        name: "Y LLORO",
        duration: "3:06",
      },
      {
        name: "MIENTRAS DUERMES",
        duration: "4:05",
      },
      {
        name: "$AD BOYZ II",
        duration: "5:25",
      },
      {
        name: "ROCKSTAR",
        duration: "4:06",
      },
      {
        name: "SERPIENTE",
        duration: "3:30",
      },
    ],
  },
];

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
