const prod = {
  url: {
    API_BASE_URL: process.env.REACT_APP_API_URL,
    OMDB_BASE_URL: 'https://api.themoviedb.org/3'
  }
}

const dev = {
  url: {
    API_BASE_URL: process.env.REACT_APP_API_URL,
    OMDB_BASE_URL: 'https://api.themoviedb.org/3'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod