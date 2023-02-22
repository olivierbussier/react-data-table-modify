import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// eslint-disable-next-line import/no-duplicates
import styles from './style.scss'
//import "./style.scss";

/**
 * Helper to compare strings and return result positive or negative,
 * depending of sens of comparison
 *
 * @param {object} a
 * @param {object} b
 * @param {object} col
 * @returns {-1|0|1}
 */
const locSort = (a, b, col) => {
  var ret;
  switch (col.type) {
    default:
    case "string":
      ret = a[col.col].localeCompare(b[col.col]);
      break;
    case "date":
      ret = new Date(a[col.col]) < new Date(b[col.col]) ? -1 : 1;
      break;
  }
  return col.sens === "asc" ? ret : -ret;
};
locSort.propTypes = {
  a: PropTypes.object,
  b: PropTypes.object,
  col: PropTypes.shape({
    col: PropTypes.string,
    sens: PropTypes.string,
  }),
};

/**
 * Main multicriteria sort method, possible to sort on 3 columns
 *
 * @param {object} col1 object containinig colName & sort order
 * @param {object} col2
 * @param {object} col3
 * @param {object} a a&b, values to compare
 * @param {object} b
 */
const sortData = (col1, col2, col3, a, b) => {
  var returnResult;

  if (col1.col && a[col1.col] === b[col1.col]) {
    // If both col1 are equal, try on col2
    if (col2.col && a[col2.col] === b[col2.col]) {
      // If both col2 are equal, try on col3 (if defined)
      if (col3.col) {
        returnResult = locSort(a, b, col3);
      } else {
        returnResult = 0;
      }
    } else {
      if (col2.col) {
        returnResult = locSort(a, b, col2);
      } else {
        returnResult = 0;
      }
    }
  } else {
    if (col1.col) {
      returnResult = locSort(a, b, col1);
    } else {
      returnResult = 0;
    }
  }
  return returnResult;
};
sortData.propTypes = {
  col1: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  col2: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  col3: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  a: PropTypes.any,
  b: PropTypes.any,
};

/**
 * This component is used to display data organised in tables
 * His number and type of colums are configurable via the parameter
 * formatCols, an array of object with the following structure:
 *
 *  - One object for each col of the data to display
 *
 * const formatCols = [
 *    {
 *      type:  'number', 'string',' or 'date',
 *      title: string (displayed in table header),
 *      data:  string (name of the object field to display)
 *    },
 *    ...
 * ]
 */
export const DataTable = ({ formatCols, data, curPage, nbPerPage }) => {
  const indexStart = curPage * nbPerPage;
  const indexEnd = curPage * nbPerPage + nbPerPage;
  const colCount = formatCols.length;

  /**
   * Reset sort columns
   * @param {string} colName First sort column name
   * @param {string} type First sort column type
  */
  const resetSort = (colName, type) => {
    return [
      { col: colName, type: type, sens: "asc" },
      { col: null, type: null, sens: "asc" },
      { col: null, type: null, sens: "asc" },
    ];
  }
  /**
   * Sort thru 3 colums, descending or ascending
   * unused sort cols must be filled with null in sortColumn
   */
  const [sortColumn, setSortColumn] = useState(resetSort(null, null));
  const [sortIndex, setSortIndex] = useState(0);
  const [dataSorted, setDataSorted] = useState(data);


 const resetSortColumns = (colName, type) => {

    setSortIndex(0);
    setSortColumn(resetSort(colName, type));
  };

  /**
   * Method used to change ort order of the current sort column
   *
   * @param {string} column Sort colomn to invert sens
   */
  const inverSortOrderOfCurrentColumn = (colName, shiftKey) => {
    var temp = [...sortColumn];

    var idx = searchColumn(colName)
    const oldSens = temp[idx].sens

    if (!shiftKey) {
      // Search of type in formatCols
      const type = searchFormat(colName).type
      temp = resetSort(colName, type)
      idx=0
      setSortIndex(0)
    }
    temp[idx].sens = oldSens === "asc" ? "desc" : "asc";
    setSortColumn(temp);
  };

  /**
   * Add a new sort column if possible (the current allocated columns
   * must be <= 2)
   *
   * @param {string} colName Sort column to add
   * @param {boolean} shift Shift key state
   */
  const addSortColumn = (colName, shift) => {
    var temp = [...sortColumn];

    // Search of type in formatCols
    const type = searchFormat(colName).type;

    if (
      (shift && sortIndex === 2) || // Already 3 search cols selected
      temp[0].col === null || // Or no column selected
      !shift // Or shift key not holded
    ) {
      // Then no room to have one column more, we init sortColumn and restart from zero
      resetSortColumns(colName, type);
    } else {
      // Room to have one column more
      temp[sortIndex + 1] = { col: colName, type: type, sens: "asc" };
      setSortIndex(sortIndex + 1);
      setSortColumn(temp);
    }
  };

  /**
   * Search in sortColumn if a.value is already present
   *
   * @param {object} a element to test (a.value is to be tested)
   * @returns {number} return index of array if found, -1 if not found
   */
  const searchColumn = (colName) => {
    for (let i = 0; i < sortColumn.length; i++) {
      if (sortColumn[i].col === colName) {
        return i;
      }
    }
    return -1;
  };

  /**
   * Search in formatCols if a.value is already present
   *
   * @param {object} a element to test (a.value is to be tested)
   * @returns {number} return index of array if found, -1 if not found
   */
  const searchFormat = (colName) => {
    for (let i = 0; i < formatCols.length; i++) {
      if (formatCols[i].data === colName) {
        return formatCols[i];
      }
    }
    return -1;
  };
  /**
   * This method is used to handle click on <th> components and modify sort order
   *
   * @param {event} e
   */
  const changeSortOrder = (e) => {
    e.preventDefault();
    document.getSelection().removeAllRanges();
    const thTarget = e.currentTarget.attributes.getNamedItem("data-name");
    const column = thTarget ? thTarget.value : null

    if (thTarget) {
      const idx = searchColumn(column);

      if (idx !== -1) {
        if (column === sortColumn[idx].col) {
          inverSortOrderOfCurrentColumn(column, e.shiftKey); // Column clicked twice, inverse sort order
        } else {
          addSortColumn(column, e.shiftKey);  // Try to set/add one column
        }
      } else {
        addSortColumn(column, e.shiftKey);  // Try to set/add one column
      }
    }
  };

  /**
   * Display cell value depending of data type
   *
   * @param {type} type Could be 'string', 'number', 'date'
   * @param {*} data Data to display
   * @returns Value to dispaly in right format
   */
  const display = (type, data) => {
    // console.log('type=', type, 'data=', data)
    switch (type) {
      case "string":
        return data;
      case "date":
        return new Date(data).toLocaleDateString("fr");
      default:
        return data;
    }
  };
  /**
   * Side effect triggered when data or sort type/order change
   */
  useEffect(() => {
    const orig = [...data];

    setDataSorted(
      orig.sort((a, b) =>
        sortData(sortColumn[0], sortColumn[1], sortColumn[2], a, b)
      )
    );
  }, [sortColumn, data]);

  return (
    <table className="data-table" role="grid">
      <thead>
        <tr>
          {formatCols.map((element, index) => {
            // Check if col is in sort columns
            const cl = sortColumn.map((col, idx) => {
              return col.col === element.data
                ? col.sens + " sort-col-" + idx
                : "";
            });
            return (
              <th
                key={"th-table-key-" + index}
                data-name={element.data}
                className={cl.join(" ").trim()}
                onClick={changeSortOrder}
              >
                {element.title}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {dataSorted.length ? (
          dataSorted.map((ligne, iLigne) =>
            iLigne >= indexStart && iLigne < indexEnd ? (
              <tr key={"tr-table-key-" + iLigne}>
                {formatCols.map((element, index) => {
                  const cl = sortColumn.map((col, idx) => {
                    return col.col === element.data
                      ? col.sens + " sort-col-" + idx
                      : "";
                  });
                  return (
                    <td
                      key={"td-table-key-" + index}
                      className={cl.join(" ").trim()}
                    >
                      {display(element.type, ligne[element.data])}
                    </td>
                  );
                })}
              </tr>
            ) : null
          )
        ) : (
          <tr>
            <td colSpan={colCount}>No matching record found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
DataTable.propTypes = {
  formatCols: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      data: PropTypes.string,
    })
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  curPage: PropTypes.number,
  nbPerPage: PropTypes.number,
};


/**
 *  Buton used in Pagination component
 *
 * @param {*} param0
 * @returns
 */
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
Button.propTypes = {
  id: PropTypes.number,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
}

/**
 * Simple component Pagination could be used in conjonction with
 * DataTable component
 *
 * @param {object} props
 * @param {number} props.nbItems Total number of items to be displayed
 * @param {number} props.nbPerPage Number of items to display on one page
 * @param {number} props.curPage Current active page
 * @param {function} props.onPageChange callable hook to handle page change (parameter : requested page)
 * @returns {JSX.Element}
 */
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
Pagination.propTypes = {
  nbItems: PropTypes.number,
  nbPerPage: PropTypes.number,
  curPage: PropTypes.number,
  onClick: PropTypes.func
}