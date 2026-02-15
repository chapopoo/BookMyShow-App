import React from 'react'
import { useEffect, useState } from 'react'
import { hideLoading, showLoading } from '../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import { getAllMovies } from '../api/movies'
import { message, Row, Col, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'

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
      }
      else {
        message.error(response.message)
      }
      dispatch(hideLoading())
    }
    catch (err) {
      message.error(err.message);
      dispatch(hideLoading());
    }
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    // implement search functionality here, e.g., filter movies based on searchText
    console.log(searchText);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Row className="justify-content-center w-100">
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            placeholder="Type here to search for movies"
            onChange={handleSearch}
            prefix={<SearchOutlined />}
          />
          <br />
          <br />
          <br />
        </Col>
      </Row>
      <Row
        className="justify-content-center"
        gutter={{
          xs: 8,
          sm: 16,
          md: 24,
          lg: 32,
        }}
      >
          {movies &&
            movies
              .filter((movie) =>
                movie.movieName?.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((movie) => (
                <Col
                  className="gutter-row mb-5"
                  key={movie._id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                >
                  <div className="movie-card" style={{ boxShadow: '0 2px 8px #ddd', borderRadius: '12px', padding: '16px', background: '#fff', marginBottom: '24px', textAlign: 'center', height: '100%' }}>
                    <img
                      onClick={() => {
                        navigate(
                          `/movie/${movie._id}?date=${(new Date()).toISOString().split('T')[0]}`
                        );
                      }}
                      className="cursor-pointer single-movie-img"
                      src={movie.poster}
                      alt="Movie Poster"
                      width={180}
                      height={260}
                      style={{ borderRadius: "8px", objectFit: 'cover', marginBottom: '12px', boxShadow: '0 1px 6px #ccc' }}
                    />
                    <h3
                      onClick={() => {
                        navigate(
                          `/movie/${movie._id}?date=${(new Date()).toISOString().split('T')[0]}`
                        );
                      }}
                      className="cursor-pointer movie-title-details"
                      style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '8px', color: '#212121' }}
                    >
                      {movie.movieName}
                    </h3>
                    <div className="movie-data">
                      <span>Genre:</span> {movie.genre} <br />
                      <span>Language:</span> {movie.language} <br />
                      <span>Duration:</span> {movie.duration} min <br />
                      <span>Release:</span> {new Date(movie.releaseDate).toLocaleDateString()}
                    </div>
                    <div style={{ color: '#555', fontSize: '14px', marginTop: '8px', minHeight: '40px' }}>{movie.description}</div>
                  </div>
                </Col>
              ))}
      </Row>
    </>
  )
}

export default Home
