CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  note         TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL DEFAULT '',
  cover        TEXT NOT NULL DEFAULT '',
  cover_alt    TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TEXT NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS posts_status_date ON posts (status, published_at DESC);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  section    TEXT NOT NULL CHECK (section IN ('second-hand', 'repair', 'installation')),
  src        TEXT NOT NULL,
  width      INTEGER NOT NULL,
  height     INTEGER NOT NULL,
  alt        TEXT NOT NULL,
  caption    TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS gallery_section_sort ON gallery_photos (section, sort);
