# Web Terminal Container

A browser-based isolated Linux terminal platform inspired by systems like Hack The Box, GitHub Codespaces, Replit, and cloud sandbox environments.

This project provides:

- Browser terminal access using xterm.js
- Real-time WebSocket communication
- PTY-backed Linux shells using node-pty
- Ephemeral isolated Docker containers per session
- Modern fullstack architecture using React + Node.js
- Infrastructure-first terminal orchestration design

---

# Project Goals

The purpose of this project is to learn and build:

- Browser-accessible Linux environments
- Realtime terminal infrastructure
- Containerized shell isolation
- WebSocket-based terminal transport
- PTY (Pseudo Terminal) management
- Secure multi-user terminal architectures
- HTB-style infrastructure systems

---

# Tech Stack

## Frontend

- React
- Vite
- TypeScript
- TailwindCSS
- xterm.js

## Backend

- Node.js
- Express
- WebSockets (`ws`)
- node-pty

## Infrastructure

- Docker
- Ubuntu Containers
- Ephemeral Runtime Sessions

---

# Final Architecture

## High Level Architecture

```text
Browser
   ↓
React Frontend
   ↓
xterm.js Terminal UI
   ↓
WebSocket Connection
   ↓
Node.js Backend
   ↓
node-pty
   ↓
Docker Container
   ↓
Ubuntu Bash Shell
```

---

# Docker Isolation Architecture

Each browser session creates its own isolated Docker container.

## Runtime Flow

```text
Browser Tab Opened
        ↓
WebSocket Connection Created
        ↓
Backend Receives Connection
        ↓
node-pty Spawns Docker Process
        ↓
Docker Creates Ubuntu Container
        ↓
Container Bash Shell Attached
        ↓
Terminal Stream Connected To Browser
```

---

# Session Architecture

Current implementation uses:

## Ephemeral Containers

Meaning:

- Every browser refresh creates a new container
- Containers are automatically destroyed after disconnect
- No persistent filesystem exists between sessions

This is implemented using:

```bash
docker run -it --rm ubuntu bash
```

---

# Why Ephemeral Containers?

Benefits:

- Isolation
- Security
- Automatic cleanup
- Disposable environments
- Reduced persistence risks
- Easier orchestration

This is a common cloud infrastructure concept.

---

# Folder Structure

```text
web-terminal-container/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Terminal.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# Features Implemented

## Frontend

- Professional dashboard layout
- Dark terminal-themed UI
- Responsive workspace
- xterm.js integration
- Live terminal rendering
- Resize handling using FitAddon

## Backend

- Express HTTP server
- WebSocket server
- Real-time terminal streaming
- PTY process management
- Docker container orchestration

## Infrastructure

- Isolated Ubuntu containers
- Resource-limited execution
- Ephemeral environments
- Per-session runtime isolation

---

# Setup Guide

# 1. Clone Repository

```bash
git clone <your-repo-url>
cd web-terminal-container
```

---

# 2. Frontend Setup

## Move Into Frontend

```bash
cd frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Install Terminal Packages

```bash
npm install @xterm/xterm @xterm/addon-fit
```

---

## Install TailwindCSS

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 3. Backend Setup

## Open New Terminal

```bash
cd backend
```

---

## Initialize Backend

```bash
npm init -y
```

---

## Install Dependencies

```bash
npm install express ws cors node-pty
```

---

# 4. Install Docker

## Ubuntu / Kali

```bash
sudo apt update
sudo apt install docker.io -y
```

---

## Start Docker

```bash
sudo systemctl start docker
```

---

## Verify Docker

```bash
docker run hello-world
```

---

# 5. Pull Ubuntu Container Image

```bash
docker pull ubuntu
```

---

# 6. Start Backend Server

```bash
node server.js
```

Backend runs on:

```text
http://localhost:3000
```

---

# 7. Open Frontend

Visit:

```text
http://localhost:5173
```

You should now have:

- Browser terminal
- Realtime shell access
- Ubuntu container sessions
- Interactive Linux commands

---

# How Terminal Communication Works

## Frontend

xterm.js captures keyboard input.

Example:

```text
ls
pwd
whoami
```

---

## WebSocket Layer

Input is sent over persistent WebSocket connection.

```text
Frontend → Backend
```

---

## Backend PTY Layer

node-pty writes input into Docker shell process.

```text
WebSocket → PTY → Docker Bash
```

---

## Output Flow

Shell output returns through PTY stream.

```text
Docker Shell → PTY → WebSocket → Browser
```

---

# Container Resource Limits

Current Docker runtime limits:

```bash
--memory=512m
--cpus=1
```

Purpose:

- Prevent abuse
- Prevent host exhaustion
- Restrict container resource usage

---

# Security Notes

## IMPORTANT

Current version is NOT production safe.

Do NOT expose publicly yet.

---

# Current Risks

- Containers run as root
- No authentication
- No HTTPS
- No rate limiting
- No network isolation
- No container hardening
- No session persistence
- No orchestration layer

---

# Planned Future Improvements

## Authentication

- Login system
- JWT sessions
- Protected terminal access

## Multi-User Infrastructure

- Per-user containers
- Session mapping
- Persistent environments

## Security Hardening

- Non-root containers
- Seccomp profiles
- Capability dropping
- Read-only filesystems
- Network restrictions

## Infrastructure

- Reverse proxy
- HTTPS
- Public tunnel access
- Idle timeout cleanup
- Container lifecycle management

---

# Important Concepts Learned

This project demonstrates:

| Concept | Description |
|---|---|
| WebSockets | Realtime bidirectional communication |
| PTY | Interactive shell process management |
| xterm.js | Browser terminal rendering |
| node-pty | Shell process orchestration |
| Docker Isolation | Runtime container separation |
| Ephemeral Compute | Disposable runtime infrastructure |
| Terminal Streaming | Live shell I/O forwarding |

---

# Troubleshooting

# WebSocket Connection Failed

## Cause

Backend not running.

## Fix

Start backend:

```bash
node server.js
```

---

# Docker Command Fails

## Cause

Docker daemon not running.

## Fix

```bash
sudo systemctl start docker
```

---

# node-pty Installation Errors

## Cause

Missing build tools.

## Fix

```bash
sudo apt install build-essential python3 make g++
```

Then reinstall:

```bash
npm install node-pty
```

---

# React Strict Mode Double Connections

In development mode React intentionally mounts twice.

This may show:

```text
Client connected
Client disconnected
Client connected
```

This is expected behavior during development.

---

# Future Architecture Direction

Target future architecture:

```text
Internet
   ↓
Authentication Layer
   ↓
Session Manager
   ↓
WebSocket Gateway
   ↓
Per-User Container Runtime
   ↓
Isolated Linux Environment
```

This evolves the platform closer toward:

- HTB
- Replit
- Codespaces
- Cloud IDE infrastructure

---

# License

MIT License

---

# Disclaimer

This project is for:

- Educational purposes
- Infrastructure learning
- Security research
- Container orchestration practice

Do not expose publicly without proper hardening and security review.