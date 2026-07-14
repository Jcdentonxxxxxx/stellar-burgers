import { FC } from 'react';
import styles from './wrapper.module.css';
type TWrapperRouterProp = {
  title: string;
  children: React.ReactElement;
  largeText?: boolean;
};
export const WrapperRouter: FC<TWrapperRouterProp> = ({
  title,
  children,
  largeText
}) => (
  <div className={`${styles.wrapper}`}>
    <h3
      className={`${styles.title} ${largeText ? styles.text_type_main_large : ''}`}
    >
      {title}
    </h3>
    {children}
  </div>
);
