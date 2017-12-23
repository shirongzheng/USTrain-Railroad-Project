-- if no entry found : create, else do nothing

DROP FUNCTION IF EXISTS ensure_seats_free_set(INTEGER, INTEGER, DATE);
CREATE FUNCTION ensure_seats_free_set
(
    _train_id INTEGER,
    _segment_id INTEGER,
    _of_date DATE DEFAULT NOW()
)
RETURNS VOID AS $$
BEGIN
    BEGIN
        INSERT INTO seats_free
        (
            train_id,
            segment_id,
            of_date,
            num_of_free_seats,
            first_class_seats
        )
        VALUES
        (
            _train_id,
            _segment_id,
            _of_date,
            448,
            64
        );
    EXCEPTION WHEN OTHERS THEN
        RETURN;
    END;
END;
$$ LANGUAGE PLPGSQL;
