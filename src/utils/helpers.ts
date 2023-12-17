import { Duplex } from "stream";

export const bufferToStream = (myBuffer: Buffer) => {
  let tmp = new Duplex();
  tmp.push(myBuffer);
  tmp.push(null);
  return tmp;
};

export const MUSIC_TYPES = {
  ALBUM: "album",
  PLAYLIST: "playlist",
  SONG: "song",
};
