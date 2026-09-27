// The data-access layer, the same shape as m5a3.
//
// Every query is parameterised: values go in the array, never into the string.
// This is the single most important habit in database code, and it is what
// stops "'; DROP TABLE materials; --" in a form field from being a real
// problem.

export async function getAll(pool) {
  const result = await pool.query(
    'SELECT * FROM materials ORDER BY uploaded_at DESC'
  )
  return result.rows
}

export async function getById(pool, id) {
  const result = await pool.query('SELECT * FROM materials WHERE id = $1', [id])
  return result.rows[0] ?? null
}

export async function create(pool, { title, content }) {
  const result = await pool.query(
    `INSERT INTO materials (title, content)
     VALUES ($1, $2)
     RETURNING *`,
    [title, content ?? '']
  )
  return result.rows[0]
}

export async function update(pool, id, { title, content }) {
  const result = await pool.query(
    `UPDATE materials
     SET title = $1, content = $2
     WHERE id = $3
     RETURNING *`,
    [title, content ?? '', id]
  )
  return result.rows[0] ?? null
}

export async function remove(pool, id) {
  const result = await pool.query(
    'DELETE FROM materials WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rowCount > 0
}
