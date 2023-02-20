# react-data-table-modify

> DataTable custom

[![NPM](https://img.shields.io/npm/v/react-data-table-modify)](https://www.npmjs.com/package/react-data-table-modify) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-data-table-modify
```

## Usage

```jsx
import React, { Component } from 'react'

import {Datatable} from 'react-data-table-modify'
import 'react-data-table-modify/dist/index.css'

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
DataTable has capabilities of pagination in combination with a Pagination component (display pages). In this case, you could send to Datatable component whole data and specify by props which part of these data you want to display

The props used to doing that are :

- nbPerPage : Number of items to display
- curPage   : The page you want to display (0 to n)

You could maintain a state variable for curPage in your App (with your pagination component) and pass this variable as props to DataTable

## Sorting capabilities
Datatable is able to sort data with 3 colums, ascending/descending
- If you click on a column header you will sort data using this column. If you click again on the same column, this will inverse the sens of sorting.
- If you maintain 'shift key' when you click on header cols, you will preserve previous sort choices (max 3)
- If you have already 3 sort cols selected and you click with shift key pressed, then you erase previous sort choices

## License

MIT © [olivierbussier](https://github.com/olivierbussier)
