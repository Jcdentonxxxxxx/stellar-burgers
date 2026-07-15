import { FC } from 'react';
import styles from './wrapper.module.css';
import { useParams } from 'react-router-dom';
type TWrapperRouterProp = {
  title: string;
  children: React.ReactElement;
  largeText?: boolean;
};
export const WrapperRouter: FC<TWrapperRouterProp> = ({
  title,
  children,
  largeText
}) => {
  const { number } = useParams();
  const createTitle = (number: string | undefined) => {
    if (number && !title) return `#${number}`;
    return title;
  };

  return (
    <div className={`${styles.wrapper}`}>
      <h3
        className={`${styles.title} ${largeText ? styles.text_type_main_large : ''}`}
      >
        {createTitle(number)}
      </h3>
      {children}
    </div>
  );
};
