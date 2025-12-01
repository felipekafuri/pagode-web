import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type ShowcaseItem = {
  title: string;
  url: string;
  description: string;
  tags?: string[];
  gradient?: string;
};

const ShowcaseList: ShowcaseItem[] = [
  {
    title: 'OpenFormy',
    url: 'https://openformy.com/',
    description: 'A modern form builder application that makes creating and managing forms simple and intuitive',
    tags: ['Forms', 'SaaS', 'Production'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
];

function ShowcaseCard({title, url, description, tags, gradient}: ShowcaseItem) {
  return (
    <div className={clsx('card', styles.showcaseCard)}>
      <div
        className={styles.showcaseGradient}
        style={{ background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <div className={styles.showcaseIcon}>🚀</div>
      </div>
      <div className="card__body">
        <Heading as="h3" className={styles.showcaseTitle}>
          {title}
        </Heading>
        <p className={styles.showcaseDescription}>{description}</p>
        {tags && tags.length > 0 && (
          <div className={styles.showcaseTags}>
            {tags.map((tag, idx) => (
              <span key={idx} className={styles.showcaseTag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="card__footer">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="button button--primary button--block">
          Visit Site →
        </a>
      </div>
    </div>
  );
}

export default function Showcase(): ReactNode {
  return (
    <section className={styles.showcase}>
      <div className="container">
        <div className="text--center">
          <Heading as="h2">Built with Pagode</Heading>
          <p className={styles.showcaseDescription}>
            Check out projects built using Pagode
          </p>
        </div>
        <div className={styles.showcaseGrid}>
          {ShowcaseList.map((props, idx) => (
            <ShowcaseCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
