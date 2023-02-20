import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

// eslint-disable-next-line import/no-duplicates
import styles from './style_module.scss'

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
  var ret
  switch (col.type) {
    default:
    case 'string':
      ret = a[col.col].localeCompare(b[col.col])
      break
    case 'date':
      ret = new Date(a[col.col]) < new Date(b[col.col]) ? -1 : 1
      break
  }
  return col.sens === 'asc' ? ret : -ret
}
locSort.propTypes = {
  a: PropTypes.object,
  b: PropTypes.object,
  col: PropTypes.shape({
    col: PropTypes.string,
    sens: PropTypes.string
  })
}

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
  var returnResult

  if (col1.col && a[col1.col] === b[col1.col]) {
    // If both col1 are equal, try on col2
    if (col2.col && a[col2.col] === b[col2.col]) {
      // If both col2 are equal, try on col3 (if defined)
      if (col3.col) {
        returnResult = locSort(a, b, col3)
      } else {
        returnResult = 0
      }
    } else {
      if (col2.col) {
        returnResult = locSort(a, b, col2)
      } else {
        returnResult = 0
      }
    }
  } else {
    if (col1.col) {
      returnResult = locSort(a, b, col1)
    } else {
      returnResult = 0
    }
  }
  return returnResult
}
sortData.propTypes = {
  col1: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  col2: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  col3: PropTypes.shape({ col: PropTypes.string, sens: PropTypes.string }),
  a: PropTypes.any,
  b: PropTypes.any
}

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
  const indexStart = curPage * nbPerPage
  const indexEnd = curPage * nbPerPage + nbPerPage
  const colCount = formatCols.length

  /**
   * Sort thru 3 colums, descending or ascending
   * unused sort cols must be filled with null in sortColumn
   */
  const [sortColumn, setSortColumn] = useState([
    { col: null, type: null, sens: 'asc' },
    { col: null, type: null, sens: 'asc' },
    { col: null, type: null, sens: 'asc' }
  ])
  const [sortIndex, setSortIndex] = useState(0)
  const [dataSorted, setDataSorted] = useState(data)

  /**
   * Method used to change ort order of the current sort column
   *
   * @param {*} shift Shift key state
   */
  const inverSortOrderOfCurrentColumn = (column) => {
    /*
     * invert sort order to selected column
     */
    var temp = [...sortColumn]
    temp[column].sens = temp[column].sens === 'asc' ? 'desc' : 'asc'
    setSortColumn(temp)
  }

  /**
   * Reset sort columns
   *
   */
  const resetSortColumns = (colName, type) => {
    var temp = [...sortColumn]


    temp = [
      { col: colName, type: type, sens: 'asc' },
      { col: null, type: null, sens: 'asc' },
      { col: null, type: null, sens: 'asc' }
    ]
    setSortIndex(0)
    setSortColumn(temp)
  }
  /**
   * Add a new sort column if possible (the current allocated columns
   * must be <= 2)
  */
 const addSortColumn = (a, shift) => {
   var temp = [...sortColumn]

   // Search of type in formatCols
   const type = searchFormat(a).type

   if (
      (shift && sortIndex === 2) || // Already 3 search cols selected
      temp[0].col === null || // Or no column selected
      !shift // Or shift key not holded
    ) {
      // Then no room to have one column more, we init sortColumn and restart from zero
      resetSortColumns(a, type)
    } else {
      // Room to have one column more
      temp[sortIndex + 1] = { col: a, type: type, sens: 'asc' }
      setSortIndex(sortIndex + 1)
      setSortColumn(temp)
    }
  }

  /**
   * Search in sortColumn if a.value is already present
   *
   * @param {object} a element to test (a.value is to be tested)
   * @returns {number} return index of array if found, -1 if not found
   */
  const searchColumn = (a) => {
    for (let i = 0; i < sortColumn.length; i++) {
      if (sortColumn[i].col === a) {
        return i
      }
    }
    return -1
  }

  /**
   * Search in formatCols if a.value is already present
   *
   * @param {object} a element to test (a.value is to be tested)
   * @returns {number} return index of array if found, -1 if not found
   */
  const searchFormat = (colName) => {
    for (let i = 0; i < formatCols.length; i++) {
      if (formatCols[i].data === colName) {
        return formatCols[i]
      }
    }
    return -1
  }
  /**
   * This method is used to handle sort order
   *
   * @param {event} e
   */
  const changeSortOrder = (e) => {
    e.preventDefault()
    document.getSelection().removeAllRanges()
    const a = e.currentTarget.attributes.getNamedItem('data-name')

    if (a) {
      const idx = searchColumn(a.value)

      if (idx !== -1 && (a.value === sortColumn[idx].col)) {
        inverSortOrderOfCurrentColumn(idx) // Column clicked twice, inverse sort order
      } else {
        addSortColumn(a.value, e.shiftKey) // Try to set/add one column
      }
    }
  }

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
      case 'string':
        return data
      case 'date':
        return new Date(data).toLocaleDateString('fr')
      default:
        return data
    }
  }
  /**
   * Side effect triggered when data or sort type/order change
   */
  useEffect(() => {
    const orig = [...data]

    setDataSorted(
      orig.sort((a, b) =>
        sortData(sortColumn[0], sortColumn[1], sortColumn[2], a, b)
      )
    )
  }, [sortColumn, data])

  return (
    <table className={styles.dataTable} role='grid'>
      <thead>
        <tr>
          {formatCols.map((element, index) => {
            // Check if col is in sort columns
            const cl = sortColumn.map((col, idx) => {
              return col.col === element.data
                ? styles[col.sens] + ' ' + styles['sort-col-' + idx]
                : ''
            })
            return (
              <th
                key={'th-table-key-' + index}
                data-name={element.data}
                className={cl.join(' ').trim()}
                onClick={changeSortOrder}
              >{element.title}</th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {dataSorted.length ? (
          dataSorted.map((ligne, iLigne) =>
            iLigne >= indexStart && iLigne < indexEnd ? (
              <tr className={styles.tbodyTr} key={'tr-table-key-' + iLigne}>
                {formatCols.map((element, index) => {
                  const cl = sortColumn.map((col, idx) => {
                    return col.col === element.data
                      ? styles[col.sens] + ' ' + styles['sort-col-' + idx]
                      : ''
                  })
                  return (
                    <td
                      key={'td-table-key-' + index}
                      className={cl.join(' ').trim()}
                    >
                      {display(element.type, ligne[element.data])}
                    </td>
                  )
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
  )
}
DataTable.propTypes = {
  formatCols: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      title: PropTypes.string,
      data: PropTypes.string
    })
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  curPage: PropTypes.number,
  nbPerPage: PropTypes.number
}
