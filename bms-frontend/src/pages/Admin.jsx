import React,{Children} from 'react'

import { Tabs} from 'antd';
import MovieList from './MovieList';
import TheatersTable from './TheatersTable';

function Admin() {
    const tabItems = [
        {
            key : '1',
            label : 'Movies', // tab name
            children : <MovieList/>
        },
        {
            key : '2',
            label : 'Theaters',
            children : <TheatersTable/>
        }
    ]
  return (
    <div>
        <h1>Admin Dashboard</h1>
        <Tabs items={tabItems}/>
    </div>
  )
}

export default Admin
