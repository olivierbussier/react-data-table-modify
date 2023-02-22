# react-data-table-modify

> DataTable custom

A simple-to-use React table library with interessting features
- Capability to be configured to display arrays of objects with simple columns configuration
- Multi-criterias sort, including typechecking (dates, numbers é& strings).
- Locale display

Short term evolution plan
- add cell editing (2.0)


[![NPM](https://img.shields.io/npm/v/react-data-table-modify)](https://www.npmjs.com/package/react-data-table-modify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## :mag_right: Preview
![image](https://raw.githubusercontent.com/olivierbussier/react-data-table-modify/main/image-doc/data-table.png)

## Live demo
https://olivierbussier.github.io/react-data-table-modify/

data for this live demo have been created using [faker](https://www.npmjs.com/package/@faker-js/faker)

## Install

```bash
npm install react-data-table-modify
```

## Usage

```jsx
import React, { Component } from 'react'

import {Datatable} from 'react-data-table-modify'

const App = () => {

    return <DataTable formatCols={} data={} curPage={} nbPerPage={} />

}
```
## Description of props


### FormatCols

This prop is used to explain to DataTable the structure of data to display. The structure understood by DataTable is an array of objects, each object describe a row of the data.

Consider you want to display an array of objects having the following data structure:
```jsx
const data = [
  {
    xName: "Calin",
    dateOfBirth: "Thu Feb 11 2020",
    description: "First pet of my wife"
  },
  ...
]
 ```
The corresponding 'formatCols' prop will be :
```jsx
const format = [
  {
    name: "Name of the animal", // Header name of the column
    data: "xName",              // name of the property in the data object
    type: "string"              // Type of the col here 'string'
  },
  {
    name: "Birth Date",
    data: "dateOfBirth" ,
    type: "date"                // Type of the col, here 'date'
  },
  {
    name: "Description",
    data: "description",
    type: "string"
  }
]
```
And finally, for these data, you will use DataTable this way

```jsx

  <DataTable formatCols={format} data={data}>
```

### Pagination

DataTable comes with a Pagination companion component. In this case, you could send to Datatable component whole data and specify by props which part of these data you want to display

The props used to doing that are :

- nbPerPage : Number of items to display
- curPage   : The page you want to display (0 to n)

You could maintain a state variable for curPage in your App (with your pagination component) and pass this variable as props to DataTable

## Usage of DataTable with Pagination component

At least, you have to declare state variables:
- First one to maintain the value of the current page.
- Second one for the number of items per page if you want this to be dynammicly changed

```jsx

import {DataTable, Pagination} from 'react-data-table-modify'

const App = () => {
  const nbPerPage = 10
  const [curPage, setCurPage] = useState(0)

  data = ...fetch / Array...

  return (
    <div>
      <DataTable
        formatCols={formatCols}
        data={data}
        curPage={curPage}
        nbPerPage={nbPerPage}
      />
      <Pagination
        nbItems={data.length}
        nbPerPage={nbPerPage}
        curPage={curPage}
        onPageChange={(page) => setCurPage(page)}
      />
    </div>
  )
}
```

## Sorting capabilities
Datatable is able to sort data with 3 colums, ascending/descending
- If you click on a column header you will sort data using this column. If you click again on the same column, this will inverse the sens of sorting.
- If you maintain 'shift key' when you click on header cols, you will preserve previous sort choices (max 3)
- If you have already 3 sort cols selected and you click with shift key pressed, then you erase previous sort choices

Columns are sorted depending of their types, meaning that dates are sorted correctly

## License

MIT © [olivierbussier](https://github.com/olivierbussier)
