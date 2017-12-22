console.log
(
`INSERT INTO segment
(
    start_station,
    end_station,
    distance,
    base_fare
)
VALUES`
);

function random_in_range(from, to)
{
    if(from === to) return from;
    return Math.round(Math.random() * (to - from)) + from;
}

for(let i = 1; i <= 24; ++i)
{
    console.log
    (
        `(${i}, ${i+1}, ${random_in_range(5, 25)}, ${random_in_range(5, 20)}),`
    );
}