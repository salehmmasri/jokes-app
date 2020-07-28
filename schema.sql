DROP TABLE IF EXISTS myexam;
CREATE TABLE myexam(
    id serial PRIMARY KEY,
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255)  
);