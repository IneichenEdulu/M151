import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: '127.0.0.1',
  //port: 3307,
  user: 'vmadmin',
  password: 'sml12345',
  database: 'movie-db',
});

await connection.connect();

export async function getAll(options) {
  let query = 'SELECT * FROM Movies WHERE user = ? OR public = 1';

  if (['asc', 'desc'].includes(options?.sort?.toLowerCase())) {
    query += ' ORDER BY title ' + options.sort;
  }

  const [data] = await connection.query(query, [options.userId]);
  return data;
}

async function insert(movie, userId) {
  const query =
    'INSERT INTO Movies (title, year, public, user) VALUES (?, ?, ?, ?)';
  const [result] = await connection.query(query, [
    movie.title,
    movie.year,
    movie.public,
    userId,
  ]);
  return { ...movie, id: result.insertId };
}

async function update(movie, userId) {
  const query =
    'UPDATE Movies SET title = ?, year = ?, public = ?, user = ? WHERE id = ?';
  await connection.query(query, [
    movie.title,
    movie.year,
    movie.public,
    userId,
    movie.id,
  ]);
  return movie;
}

export async function get(id, userId) {
  const query =
    'SELECT * FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
  const [data] = await connection.query(query, [id, userId]);
  return data.pop();
}

export async function remove(id, userId) {
  const query = 'DELETE FROM Movies WHERE id = ? AND (user = ? OR public = 1)';
  await connection.query(query, [id, userId]);
  return;
}

export function save(movie, userId) {
  if (!movie.id) {
    return insert(movie, userId);
  } else {
    return update(movie, userId);
  }
}
