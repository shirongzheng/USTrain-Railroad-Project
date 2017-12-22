
function add_20_minute(hour, minute)
{
    if(minute + 20 >= 60)
        return {
            hour: (hour + 1) > 23 ? (hour + 1) - 24 : (hour + 1),
            minute: (minute + 20) - 60
        }
    else return { hour: hour, minute : minute + 20 }
}


function add_5_minute(hour, minute)
{
    if(minute + 5 >= 60)
        return {
            hour: (hour + 1) > 23 ? (hour + 1) - 24 : (hour + 1),
            minute: (minute + 5) - 60
        }
    else return { hour: hour, minute : minute + 5 }
}

function return_one(left, right)
{
    return random_in_range(0, 1) ? left : right;
}


// 4 - 11 : morning
// 12 - 19 : afternoon
// 20 - 3 : evening

console.log
(
`INSERT INTO stops_at
(
    train_id,
    station_id,
    arrival_time,
    departure_time
)
VALUES`
);

function stops_at_value(train_number, starting_time_code)
{
    let starting_hour = undefined;
    if(starting_time_code === 1)  // evening
        starting_hour = return_one(random_in_range(20, 23), random_in_range(0, 3));
    else if(starting_time_code === 2) // afternoon
        starting_hour = random_in_range(12, 19);
    else // morning
        starting_hour = random_in_range(4, 11);

    let starting_minute = random_in_range(0, 60);

    let end_hour = add_5_minute(starting_hour, starting_minute).hour;
    let end_minute = add_5_minute(starting_hour, starting_minute).minute;

    // let next_station = train_number > 15 ? 24 : 2;
    let k_is = train_number > 15 ? 25 : 1;
    for(let k = k_is; train_number > 15 ? k >= 1 : k <= 25; train_number > 15 ? --k : ++k)
    {
        console.log
        (
`(${train_number}, ${k}, '${starting_hour}:${starting_minute}', '${end_hour}:${end_minute}'),`
        );

        starting_hour = add_20_minute(starting_hour, starting_minute).hour;
        starting_minute = add_20_minute(starting_hour, starting_minute).minute;

        end_hour = add_5_minute(starting_hour, starting_minute).hour;
        end_minute = add_5_minute(starting_hour, starting_minute).minute;
    }

}


/*
for(let i = 16; i <= 30; ++i)
{
    let starting_hour = return_one(random_in_range(20, 23), random_in_range(0, 3));
    let starting_minute = random_in_range(0, 60);

    let end_hour = add_5_minute(starting_hour, starting_minute).hour;
    let end_minute = add_5_minute(starting_hour, starting_minute).minute;

    let next_station = 24;
    for(let k = 25; k > 1; --k)
    {
        console.log
        (
`(${i}, ${k}, ${next_station--}, ${starting_hour}:${starting_minute}, ${end_hour}:${end_minute})${i+1 > 30 && k -1 <= 1 ? ';' : ','}`
            // i,
            // k,
            // next_station--,
            // `${starting_hour}:${starting_minute}`,
            // `${end_hour}:${end_minute}`
        );

        starting_hour = add_20_minute(starting_hour, starting_minute).hour;
        starting_minute = add_20_minute(starting_hour, starting_minute).minute;

        end_hour = add_5_minute(starting_hour, starting_minute).hour;
        end_minute = add_5_minute(starting_hour, starting_minute).minute;
    }
}
*/

function random_in_range(from, to)
{
    if(from === to) return from;
    return Math.round(Math.random() * (to - from)) + from;
}

let train = 1;

stops_at_value(1, 3);
stops_at_value(2, 3);
stops_at_value(3, 3);
stops_at_value(4, 2);
stops_at_value(5, 2);
stops_at_value(6, 2);
stops_at_value(7, 1);
stops_at_value(8, 1);


stops_at_value(9, 3);
stops_at_value(10, 3);
stops_at_value(11, 3);
stops_at_value(12, 2);
stops_at_value(13, 1);
stops_at_value(14, 2);
stops_at_value(15, 1);


stops_at_value(16, 3);
stops_at_value(17, 3);
stops_at_value(18, 3);
stops_at_value(19, 2);
stops_at_value(20, 2);
stops_at_value(21, 2);
stops_at_value(22, 1);
stops_at_value(23, 1);

stops_at_value(24, 3);
stops_at_value(25, 2);
stops_at_value(26, 2);
stops_at_value(27, 3);
stops_at_value(28, 2);
stops_at_value(29, 2);
stops_at_value(30, 1);

// 3 -- morning
// 2 -- afternoon
// 1 -- evening

/*

01 -- null, morning
01 -- null, morning
10 -- morning, null
11 -- afternoon, afternoon
11 -- afternoon, afternoon
00 -- null, null
11 -- evening, evening
00 -- null, null

saturday : 1 morning, 2 afternoon, 1 evening
sunday: 2 morning, 2 afternoon, 1 evening

01 -- null, morning
10 -- morning, null
10 -- morning, null
01 -- null, afternoon
01 -- null, evening
10 -- afternoon, null
10 -- evening, null

----------------------------
 00 -- null
 11 -- morning, morning
 11 -- morning, morning
 01 -- null, afternoon
 00 -- null
 10 -- afternoon, null
 10 -- evening, null
 11 -- evening, evening

saturday: 2 morning, 1 afternoon, 2 evening
sunday: 2 morning, 1 afternoon, 1 evening

 10 -- morning, null
 10 -- afternoon, null
 10 -- afternoon, null
 01 -- null, morning
 01 -- null, afternoon
 01 -- null, afternoon
 01 -- null, evening

*/