import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideLoading, showLoading } from '../redux/loaderSlice'
import { getAllMovies } from '../api/movies'
import { message, Row, Col, Input, Tag, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons'
import '../home.css'

const Home = () => {
  const [movies, setMovies] = useState(null)
  const [searchText, setSearchText] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getData = async () => {
    try {
      dispatch(showLoading())
      const response = await getAllMovies()
      if (response.success) {
        setMovies(response.movies)
      } else {
        message.error(response.message)
      }
      dispatch(hideLoading())
    } catch (err) {
      message.error(err.message)
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const todayDate = new Date().toISOString().split('T')[0]

  const filteredMovies = movies
    ? movies.filter((movie) =>
      movie.movieName?.toLowerCase().includes(searchText.toLowerCase())
    )
    : []

  return (
    <div className="home-wrap">

      {/* ── Section heading + search in one row ── */}
      <div className="home-top-row">
        <div>
          <h2 className="home-section-title">Now Showing</h2>
          <p className="home-section-sub">
            {movies ? `${filteredMovies.length} movies available` : 'Loading...'}
          </p>
        </div>
        <Input
          placeholder="Search movies..."
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined style={{ color: '#1f5c71' }} />}
          className="home-search"
          allowClear
        />
      </div>

      {/* ── Divider ── */}
      <div className="home-divider" />

      {/* ── Movie grid ── */}
      {movies && filteredMovies.length === 0 ? (
        <Empty description="No movies found" style={{ marginTop: 60 }} />
      ) : (
        <Row gutter={[20, 24]}>
          {filteredMovies.map((movie) => (
            <Col key={movie._id} xs={12} sm={8} md={8} lg={6} xl={6}>
              <div
                className="movie-card"
                onClick={() => navigate(`/movie/${movie._id}?date=${todayDate}`)}
              >
                {/* Poster */}
                <div className="movie-poster-wrap">
                  <img
                    src={movie.poster}
                    alt={movie.movieName}
                    className="movie-poster"
                  />
                  <div className="movie-poster-overlay">
                    <span className="book-chip">Book Tickets</span>
                  </div>
                </div>

                {/* Info */}
                <div className="movie-info">
                  <p className="movie-card-title" title={movie.movieName}>
                    {movie.movieName}
                  </p>

                  {movie.genre && (
                    <Tag color="cyan" className="movie-tag">{movie.genre}</Tag>
                  )}

                  <div className="movie-meta">
                    {movie.duration && (
                      <span><ClockCircleOutlined /> {movie.duration} min</span>
                    )}
                    {movie.releaseDate && (
                      <span>
                        <CalendarOutlined />{' '}
                        {new Date(movie.releaseDate).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default Home