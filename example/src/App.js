import React, { useState } from 'react'

import { DataTable, Pagination } from 'react-data-table-modify'

import { data } from './data.jsx'

const formatCols = [
  { title: 'First Name', data: 'firstName', type: 'string' },
  { title: 'Last Name', data: 'lastName', type: 'string' },
  { title: 'Start Date', data: 'startDate', type: 'date' },
  { title: 'Department', data: 'department', type: 'string' },
  { title: 'Date of Birth', data: 'dateOfBirth', type: 'date' },
  { title: 'Street', data: 'street', type: 'string' },
  { title: 'City', data: 'city', type: 'string' },
  { title: 'State', data: 'state', type: 'string' },
  { title: 'Zip Code', data: 'zipCode', type: 'string' }
]
const App = () => {
  const nbPerPage = 10
  const [curPage, setCurPage] = useState(0)

  // When the page number change
  const onPageChange = (page) => {
    setCurPage(page)
  }

  return (
    <div style={{ maxWidth: 1200, width: '100%', margin: '15px auto' }}>
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
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default App
