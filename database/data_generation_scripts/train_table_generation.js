function random_in_range(from, to)
{
    if(from === to) return from;
    return Math.round(Math.random() * (to - from)) + from;
}


let morning = [];
while(morning.length < 3)
{
    let i = random_in_range(1, 8);
    if(morning.indexOf(i) === -1) morning.push(i);
}

let remaining = [];
for(let i = 1; i <= 8; ++i)
    if(morning.indexOf(i) === -1) remaining.push(i);

let afternoon = [];
while(afternoon.length < 3)
{
    let i = random_in_range(1, 5);
    if(afternoon.indexOf(remaining[i-1]) === -1)
        afternoon.push(remaining[i-1]);
}

let evening = [];
for(let i = 1; i <= 8; ++i)
    if(morning.indexOf(i) === -1 && afternoon.indexOf(i) === -1) evening.push(i);

// -------------------------------------------------------------------------------


let quota = {};

function set_quota()
{
    quota['M'] = 4;
    quota['W'] = 4;
    quota['T'] = 4;
    quota['Th'] = 4;
    quota['F'] = 4;
    quota['S'] = 4;
    quota['Su'] = 4;
}

set_quota();

function get_schedule()
{
    let schedule = '';
    for(day in quota)
    {
        if(day[0] == 'S' && quota[day] > 0)
        {
            if(random_in_range(0, 1) === 1)
            {
                quota[day] -= 1;
                schedule += '1';
            }
            else
            {
                schedule += '0';
            }
        }
        else if(quota[day] > 0)
        {
            quota[day] -= 1;
            schedule += '1';
        }
        else
        {
            schedule += '0'
        }
    }
    return schedule;
}

function has_quota_filled()
{
    for(day in quota)
        if(quota[day] !== 0) return false;

    return true;
}

process.stdout.write
(
`INSERT INTO train
(
    start_station,
    end_station,
    days
)
VALUES
`
);

while(!has_quota_filled())
{
    let schedule = get_schedule();
    if(schedule === '0000000') continue;
    console.log(`( 1, 25, '${schedule}'),`);
}
set_quota();
while(!has_quota_filled())
{
    let schedule = get_schedule();
    if(schedule === '0000000') continue;
    console.log(`(25, 1, '${schedule}')${(has_quota_filled() ? ';' : ',')}`);
}
