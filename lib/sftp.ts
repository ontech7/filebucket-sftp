import "server-only";

import SftpClient from "ssh2-sftp-client";

export const formatSftpRemotePath = (folder: string, fileName?: string) =>
  !fileName
    ? `${process.env.SFTP_FOLDER!}/${folder}`
    : `${process.env.SFTP_FOLDER!}/${folder}/${fileName}`;

export const sftpConfig: SftpClient.ConnectOptions = {
  host: process.env.SFTP_HOST!,
  port: Number(process.env.SFTP_PORT!),
  username: process.env.SFTP_USERNAME!,
  password: process.env.SFTP_PASSWORD!,
};
