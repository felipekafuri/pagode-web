---
sidebar_position: 1
---

# Introduction

## Overview

**Pagode** is not a framework — it's a modern starter kit for building full-stack web applications using **Go**, **InertiaJS**, and **React**, powered by **Tailwind CSS** for styling.

Pagode provides the structure and tooling you need to hit the ground running, without locking you into rigid conventions or heavyweight abstractions. It balances flexibility and productivity by letting you swap out pieces as needed while still offering a solid foundation of battle-tested technologies.

Out of the box, Pagode includes **comprehensive payment integration** with Stripe, supporting both subscription billing and one-time purchases, making it perfect for SaaS applications and e-commerce platforms.

While JavaScript frontends dominate the landscape, Pagode embraces a hybrid approach: it combines server-side rendering and client-side interactivity to deliver fast, modern user experiences — without sacrificing simplicity. Thanks to tools like InertiaJS and Tailwind, you can build reactive, beautiful interfaces with minimal boilerplate and zero custom Webpack/Vite configuration.

Pagode proves that Go is not just for APIs — it's a powerful full-stack solution when paired with the right tools. And yes, you still get the control, speed, and simplicity you love about Go.

## Foundation

While many great projects were used to build Pagode, the following provide the foundation of the back and frontend. It's important to note that you are **<ins>not required to use any of these</ins>**. Swapping any of them out is relatively easy.

### Backend

- [Echo](https://echo.labstack.com/): High performance, extensible, minimalist Go web framework.
- [Ent](https://entgo.io/): Simple, yet powerful ORM for modeling and querying data.

### Frontend

With **server-side rendered HTML** powered by **Go** and **InertiaJS**, you get the best of both worlds — a modern SPA-like experience with server-driven logic. Combined with the tools below, you can build beautiful, dynamic UIs without the usual frontend overhead.

- [InertiaJS](https://inertiajs.com/): Bridges your Go backend with modern JavaScript frameworks like React, enabling full-page SPA experiences without building a separate API.
- [React](https://reactjs.org/): A declarative library for building interactive UIs, perfectly paired with Inertia for dynamic frontend behavior.
- [Tailwind CSS v4](https://tailwindcss.com/): A utility-first CSS framework for rapidly building custom designs directly in your markup — no context switching or naming class conflicts.
- [shadcn/ui](https://ui.shadcn.com/): A beautifully designed, accessible component library built on top of Tailwind CSS and Radix UI — perfect for rapidly building consistent interfaces.

### Storage

- [SQLite](https://sqlite.org/): A small, fast, self-contained, high-reliability, full-featured, SQL database engine and the most used database engine in the world.

## Getting Started

### Dependencies

Ensure that [Go](https://go.dev/) is installed on your system.

### Getting the Code

Start by checking out the repository. Since this repository is a _template_ and not a Go _library_, you **do not** use `go get`.

```bash
git clone git@github.com:occult/pagode.git
cd pagode
```

### Create an Admin Account

To access the admin panel, you need an admin user account. To create your first admin user, use the command-line:

```bash
make admin email=your@email.com
```

This will generate an admin account using that email address and print the randomly-generated password.

### Start the Application

Before starting, install the frontend dependencies:

```bash
npm install
```

Then, start the Vite frontend development server:

```bash
npx vite
```

From within the root of the codebase, run:

```bash
make run
```

By default, you can access the application at `localhost:8000`. Your data will be stored in the `dbs` directory.

### Live Reloading

For automatic rebuilding when code changes, install [air](https://github.com/air-verse/air) and use:

```bash
make air-install
make watch
```
