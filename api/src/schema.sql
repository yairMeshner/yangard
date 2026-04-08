CREATE TABLE IF NOT EXISTS users (
    uuid        VARCHAR(36) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS children (
    id                    SERIAL PRIMARY KEY,
    parent_uuid           VARCHAR(36) NOT NULL REFERENCES users(uuid),
    name                  VARCHAR(255) NOT NULL,
    year_of_birth         INTEGER NOT NULL,
    gender                VARCHAR(50),
    mental_considerations TEXT
);

CREATE TABLE IF NOT EXISTS key_events (
    id          SERIAL PRIMARY KEY,
    user_uuid   VARCHAR(36) NOT NULL REFERENCES users(uuid),
    key_events  JSONB NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
