import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Pagode",
  tagline:
    "Pagode is not a framework — it's a modern starter kit for building full-stack web applications using Go, InertiaJS, and React, powered by Tailwind CSS for styling.",
  favicon: "img/drum-emoji.svg",

  // Future flags, see https://pagode.io/docs/api/pagode-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Pagode v4
  },

  // Set the production url of your site here
  url: "https://your-pagode-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "axioms", // Usually your GitHub org/user name.
  projectName: "pagode", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/occult/pagode",
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   feedOptions: {
        //     type: ["rss", "atom"],
        //     xslt: true,
        //   },
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl: "https://github.com/occult/pagode",
        //   // Useful options to enforce blogging best practices
        //   onInlineTags: "warn",
        //   onInlineAuthors: "warn",
        //   onUntruncatedBlogPosts: "warn",
        // },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    require.resolve("./src/plugins/tailwind-config"),
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-PDQ9RJKCPM',
        anonymizeIP: true,
      },
    ],
  ],

  themeConfig: {
    // Project's social card with drum emoji logo
    image: "img/pagode-social-card.svg",
    navbar: {
      title: "Pagode",
      logo: {
        alt: "Pagode Logo",
        src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><text x="0" y="20" font-size="20">🥁</text></svg>',
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Tutorial",
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: "https://github.com/occult/pagode",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/pagode",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/pagode",
            },
            {
              label: "X",
              href: "https://x.com/pagode",
            },
          ],
        },
        {
          title: "More",
          items: [
            // {
            //   label: "Blog",
            //   to: "/blog",
            // },
            {
              label: "GitHub",
              href: "https://github.com/occult/pagode",
            },
          ],
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
