import { FC } from 'react';
import styles from './wrapper.module.css';
type TWrapperRouterProp = { title: string; children: React.ReactElement };
export const WrapperRouter: FC<TWrapperRouterProp> = ({ title, children }) => (
  <div className={`${styles.wrapper}`}>
    <h3 className={`${styles.title}`}>{title}</h3>
    {children}
  </div>
);
