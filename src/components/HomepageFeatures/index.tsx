import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Modern Starter Kit",
    Svg: require("@site/static/img/undraw_pagode_mountain.svg").default,
    description: (
      <>
        Not a framework, but a flexible foundation for building full-stack web
        apps using Go, InertiaJS, and React, powered by Tailwind CSS for
        beautiful styling.
      </>
    ),
  },
  {
    title: "Balanced Approach",
    Svg: require("@site/static/img/undraw_pagode_tree.svg").default,
    description: (
      <>
        Combines server-side rendering with client-side interactivity for fast,
        modern experiences—without sacrificing simplicity or requiring complex
        configurations.
      </>
    ),
  },
  {
    title: "Production-Ready",
    Svg: require("@site/static/img/undraw_pagode_react.svg").default,
    description: (
      <>
        No scaffolding rewrites, no post-hackathon refactors. Pagode ships with
        sane defaults, built-in auth, database integration, environment config,
        and deployable Docker support.
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
