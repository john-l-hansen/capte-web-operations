import React from 'react';
import * as styles from './Template.module.css';

export interface TemplateProps {
  title?: string;
  body?: string;
}

export const Template: React.FC<TemplateProps> = ({
  title = 'Default Title',
  body = 'Default description body text.',
}) => {
  return (
    <div className={styles.templateComponent}>
      {title && <h3 className={styles.heading}>{title}</h3>}
      {body && <p className={styles.bodyText}>{body}</p>}
    </div>
  );
};

export default Template;
