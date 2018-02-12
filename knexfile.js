module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/garbage_bin',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
