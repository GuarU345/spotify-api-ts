import { Duplex } from "stream";

export const bufferToStream = (myBuffer: Buffer) => {
  let tmp = new Duplex();
  tmp.push(myBuffer);
  tmp.push(null);
  return tmp;
};
