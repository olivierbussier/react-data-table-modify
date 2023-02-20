import React from 'react'
import styles from "./style.scss";

const Button = ({
  id,
  onClick,
  disabled = false,
  active,
  children,
  className,
}) => {
  return (
    <button
      className={className + (active ? " active" : "")}
      id={id}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Pagination = ({ nbItems, nbPerPage, curPage, onPageChange }) => {
  let res = [];
  const nbPages = Math.ceil(nbItems / nbPerPage);

  res.push(
    <Button
      className="left-btn"
      key="btn-page-key-left"
      disabled={curPage === 0}
      onClick={() => onPageChange(curPage - 1)}
    >
      {"<<"}
    </Button>
  );

  for (let i = 0; i < nbPages; i++) {
    res.push(
      <Button
        className="middle-btn"
        key={"btn-page-key-" + i}
        active={i === curPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Button>
    );
  }

  res.push(
    <Button
      className="right-btn"
      key="btn-page-key-right"
      disabled={nbPages === 0 || curPage === nbPages - 1}
      onClick={() => onPageChange(curPage + 1)}
    >
      {">>"}
    </Button>
  );

  return <div className="app-pagination">{res}</div>;
};
