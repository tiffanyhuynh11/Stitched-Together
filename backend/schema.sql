DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    birthday TEXT,
    relationship TEXT,
    so TEXT,
    notes TEXT,
    gifts TEXT
);
