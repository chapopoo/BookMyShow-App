import React from 'react'
import { Table } from 'antd'

function MovieList() {
    const movies = [
        {
            key: "1",
            poster: "https://m.media-amazon.com/images/I/51NiGlapXlL._AC_.jpg",
            movieName: "The Shawshank Redemption",
            description: "Two imprisoned",
            duration: 142,
            genre: "Drama",
            language: "English",
            releaseDate: "1994-09-23",
            action: "Edit/Delete"
        }
    ]

    const tableHeadings = [
        {
            title: "Movie Name",
            dataIndex: "movieName", //key to access the data from the data source movies
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Duration",
            dataIndex: "duration",
            render: (text) => {
                return `${text} Min`;
            },
        },
        {
            title: "Genre",
            dataIndex: "genre",
        },
        {
            title: "Language",
            dataIndex: "language",
        },
    ];
    return (
        <>
            <div>
                MovieList
            </div>
            <Table dataSource={movies} columns={tableHeadings} />
        </>
    )
}

export default MovieList
