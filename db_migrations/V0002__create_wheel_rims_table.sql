CREATE TABLE t_p25589527_tire_news_platform.wheel_rims (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100),
    model VARCHAR(100),
    diameter NUMERIC(5,1),
    width NUMERIC(5,1),
    pcd VARCHAR(50),
    et INTEGER,
    dia NUMERIC(6,1),
    color VARCHAR(100),
    material VARCHAR(50),
    price NUMERIC(12,2),
    in_stock BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);