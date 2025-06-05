import { User } from "@hackler/react-sdk";
import { parse } from "cookie";
import { IncomingMessage } from "http";
import { HACKLE_DEVICE_COOKIE_NAME } from "./cookies";

export const resolveServerSideUser = ({
  req,
}: {
  req: IncomingMessage | undefined;
}): User => {
  const parsedSetCookie = parse(req?.headers["set-cookie"]?.toString() ?? "");
  const parsedCookie = parse(req?.headers.cookie ?? "");
  const deviceId = { ...parsedSetCookie, ...parsedCookie }[
    HACKLE_DEVICE_COOKIE_NAME
  ];

  return {
    deviceId,
  };
};
