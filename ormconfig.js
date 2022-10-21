module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['src/**/entities/*.ts'],
  logging: false,
  migrations: ['dist/src/migration/**/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  cli: {
    entitiesDir: 'dist/src/entity',
    migrationsDir: 'dist/src/migration',
    subscribersDir: 'dist/src/subscriber',
  },
};
