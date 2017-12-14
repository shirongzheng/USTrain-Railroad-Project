-- On heroku, reset db before running this file:
-- heroku pg:reset --app <app_name>

CREATE TABLE station
( id                 SERIAL PRIMARY KEY,
    name               TEXT NOT NULL,
    accessibility_code SMALLINT NOT NULL
);

CREATE TABLE segment
(
    id            SERIAL PRIMARY KEY,
    start_station INTEGER NOT NULL REFERENCES station(id),
    end_station   INTEGER NOT NULL REFERENCES station(id),
    distance      INTEGER NOT NULL,
    base_fare     NUMERIC(7, 2) NOT NULL
);

CREATE TABLE train
(

    id            SERIAL PRIMARY KEY,
    start_station INTEGER NOT NULL REFERENCES station(id),
    end_station   INTEGER NOT NULL REFERENCES station(id),
    days          TEXT NOT NULL /* mtwhfsu, eg: 1001010 -> mon, th, sat*/
);

CREATE TABLE seats_free
(
    train_id          INTEGER NOT NULL REFERENCES train(id),
    segment_id        INTEGER NOT NULL REFERENCES segment(id),
    of_date           DATE NOT NULL DEFAULT NOW(),
    num_of_free_seats SMALLINT NOT NULL, /* (7 * 64) = 448 */

    PRIMARY KEY(train_id, segment_id, of_date)
);

CREATE TABLE stops_at
(
    train_id       INTEGER NOT NULL REFERENCES train(id),
    station_id     INTEGER NOT NULL REFERENCES station(id),
    arrival_time   TIME NOT NULL,
    departure_time TIME NOT NULL,

    PRIMARY KEY(train_id, station_id)
);

CREATE TABLE passenger
(
    id      SERIAL PRIMARY KEY,
    name    TEXT NOT NULL,
    address TEXT NOT NULL,
    email   TEXT NOT NULL,
    phone   TEXT NOT NULL
);

CREATE TABLE reservation
(
    id             SERIAL PRIMARY KEY,
    passenger_id   INTEGER NOT NULL REFERENCES passenger(id),
    on_date        DATE NOT NULL,
    total_fare     NUMERIC(7, 2) NOT NULL,
    payment_type   SMALLINT NOT NULL
);

CREATE TABLE trip
(
    id             SERIAL PRIMARY KEY,
    passenger_id   INTEGER NOT NULL REFERENCES passenger(id),
    start_station  INTEGER NOT NULL REFERENCES station(id),
    end_station    INTEGER NOT NULL REFERENCES station(id),
    reservation_id INTEGER NOT NULL REFERENCES reservation(id),
    train_id       INTEGER NOT NULL REFERENCES train(id),
    on_date        DATE NOT NULL
);






INSERT INTO station
(
    name,
    accessibility_code
)
VALUES
('Boston, MA - South Station', 2),
('Boston, MA - Back Bay Station', 7),
('Route 128, MA', 9),
('Providence, RI', 10),
('Kingston, RI', 4),
('Westerly,RI', 2),
('Mystic, CT', 5),
('New London, CT', 8),
('Old Saybrook, CT', 5),
('New Haven, CT', 6),
('Bridgeport, CT', 3),
('Stamford, CT', 7),
('New Rochelle, NY',1),
('New York, NY - Penn Station', 2),
('Newark, NJ', 10),
('Newark Liberty Intl. Air., NJ', 1),
('Metro Park, NJ', 8),
('Trenton, NJ', 2),
('Philadelphia, PA - 30th Street Station', 3),
('Wilmington, DE - J.R. Biden, Jr. Station', 10),
('Aberdeen, MD', 3),
('Baltimore, MD - Penn Station', 1),
('BWI Marshall Airport, MD', 4),
('New Carrollton, MD', 3),
('Washington, DC - Union Station', 10);




INSERT INTO segment
(
    start_station,
    end_station,
    distance,
    base_fare
)
VALUES
(1, 2, 146, 56),
(2, 3, 261, 45),
(3, 4, 440, 58),
(4, 5, 426, 19),
(5, 6, 264, 27),
(6, 7, 41, 20),
(7, 8, 363, 57),
(8, 9, 412, 54),
(9, 10, 240, 13),
(10, 11, 411, 59),
(11, 12, 69, 42),
(12, 13, 480, 31),
(13, 14, 140, 24),
(14, 15, 115, 57),
(15, 16, 51, 18),
(16, 17, 461, 43),
(17, 18, 24, 60),
(18, 19, 255, 14),
(19, 20, 460, 11),
(20, 21, 332, 42),
(21, 22, 416, 55),
(22, 23, 437, 37),
(23, 24, 62, 15),
(24, 25, 129, 29);




INSERT INTO train
(
    start_station,
    end_station,
    days
)
VALUES
( 1, 25, '1111101'),
( 1, 25, '1111101'),
( 1, 25, '1111110'),
( 1, 25, '1111111'),
( 1, 25, '1111111'),
( 1, 25, '1111100'),
( 1, 25, '1111111'),
( 1, 25, '1111100'),
( 1, 25, '0000001'),
( 1, 25, '0000010'),
( 1, 25, '0000010'),
( 1, 25, '0000001'),
( 1, 25, '0000001'),
( 1, 25, '0000010'),
( 1, 25, '0000010'),
(25, 1, '1111100'),
(25, 1, '1111111'),
(25, 1, '1111111'),
(25, 1, '1111101'),
(25, 1, '1111100'),
(25, 1, '1111110'),
(25, 1, '1111110'),
(25, 1, '1111111'),
(25, 1, '0000010'),
(25, 1, '0000010'),
(25, 1, '0000010'),
(25, 1, '0000001'),
(25, 1, '0000001'),
(25, 1, '0000001'),
(25, 1, '0000001');
