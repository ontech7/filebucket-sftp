# How to run a local SFTP server

This guide shows you how to quickly run an SFTP server on your local machine using the built-in SSH server available on Linux, macOS, or Windows.

## Linux (Ubuntu/Debian)

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

## macOS

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

## Windows 10 / 11

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

## Testing your local SFTP

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
