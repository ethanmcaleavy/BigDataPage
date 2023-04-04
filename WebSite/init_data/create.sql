DROP TABLE IF EXISTS songs;
CREATE TABLE songs(
    name VARCHAR(100) NOT NULL,
    artwork_url TEXT,
    artist_name VARCHAR(100),
    genre VARCHAR(50),
    release_date DATE,
    link TEXT
);

DROP TABLE IF EXISTS reviewedSongs;
CREATE TABLE reviewedSongs(
    name VARCHAR(100) NOT NULL,
    artwork_url TEXT,
    artist_name VARCHAR(100),
    genre VARCHAR(50),
    release_date DATE,
    link TEXT,
    rating INT,
    description VARCHAR(100),
    reviewer_name VARCHAR(100),
    review_date DATE
);

CREATE TABLE DatabaseImageTable (
    project_num INT AUTOINCREMENT PRIMARY KEY , 
	imageName VARCHAR(45),
    imageFile VARBINARY(max)  
);