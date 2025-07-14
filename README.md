# FileBucket - SFTP

A simple application for uploading and sharing files securely via SFTP.

<img width="237" height="75" alt="68747470733a2f2f692e6962622e636f2f5056627a687a742f53637265656e73686f742d323032352d30372d31342d616c6c652d30312d31332d30342e706e67" src="https://github.com/user-attachments/assets/7b8a6154-5294-42c8-ad9f-0928a5f4d34e" />

## Contents

- [Features](#features)
- [Preview](#preview)
- [What is used](#what-is-used)
- [How to run a local SFTP server](#how-to-run-a-local-sftp-server)

## Features

- Upload files (images, videos, documents, etc.) without authentication.
- Generate a run-time link to be shared.
- Possibility to set a password (hashed on DB).
- Images will have a preview compressed with `sharp` lib.
- Download as stream.
- Download all as zip.

## Preview

<img width="1195" height="613" alt="68747470733a2f2f692e6962622e636f2f53446868574236662f53637265656e73686f742d323032352d30372d31342d616c6c652d30312d31382d30312e706e67" src="https://github.com/user-attachments/assets/7cda0fb9-b690-4fc4-b1fb-7e13d6989a08" />

<img width="1049" height="580" alt="68747470733a2f2f692e6962622e636f2f687853544b4e71562f53637265656e73686f742d323032352d30372d31342d616c6c652d30312d31382d33392e706e67" src="https://github.com/user-attachments/assets/5f4181a8-3cc9-4532-b0a4-bcfa0ee3d2ed" />

<img width="1182" height="758" alt="68747470733a2f2f692e6962622e636f2f7a544759306339432f53637265656e73686f742d323032352d30372d31342d616c6c652d30312d32302d34352e706e67" src="https://github.com/user-attachments/assets/a1942ef5-b71c-444e-a06f-1462b39c6b3f" />


## What is used

- Next.js 15 — for server-side rendering and routing.
- shadcn — UI components.
- Prisma — to query the database using Prisma ORM (with Neon DB).
- bcrypt — for secure password hashing.
- Zod — for schema validation and data parsing.
- Sharp — for image processing and optimization.
- ssh2-sftp-client — for SFTP file transfer operations.
- archiver - for ZIP compression.
- ws — for WebSocket communication.

## How to run a local SFTP server

This guide shows you how to quickly run an SFTP server on your local machine using the built-in SSH server available on Linux, macOS, or Windows.

### Linux (Ubuntu/Debian)

1. Install OpenSSH server

```bash
sudo apt update
sudo apt install openssh-server
```

2. Start and check the SSH service

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

3. Create a user (optional)

```bash
sudo adduser myuser
```

4. Get your local IP address

```bash
hostname -I
```

5. Connect via SFTP

```bash
sftp myuser@LOCAL_IP
```

### macOS

1. Enable Remote Login

- Go to System Preferences → Sharing → Remote Login
- Select which users can log in

2. Find your username

```bash
whoami
```

3. Get your local IP address

```bash
ifconfig
# or
ipconfig getifaddr en0
```

4. Connect via SFTP

```bash
sftp myuser@LOCAL_IP
```

### Windows 10 / 11

1. Install OpenSSH Server

- Open Settings → System → Optional Features → Add a feature
- Search for OpenSSH Server and install it

2. Start the SSH server

```bash
Start-Service sshd
```

3. Set the SSH server to start automatically

```bash
Set-Service -Name sshd -StartupType 'Automatic'
```

4. Check your local IP address

```bash
ipconfig
```

5. Connect via SFTP

```bash
sftp myuser@LOCAL_IP
```

### Testing your local SFTP

- Use the sftp command:

```bash
sftp myuser@LOCAL_IP
```

- Or connect with a GUI client like FileZilla:

```bash
Protocol: SFTP
Host: sftp://LOCAL_IP
Port: 22 (default)
Username: myuser
```
