--Transit type table, enforces unique transit type names
create table transit_type(
    id int not null auto_increment,
    transit_type varchar(40) not null,
    unique(transit_type),
    primary key(id)
);

--Transit station table, no foreign keys
create table transit_station(
    id int not null auto_increment,
    name varchar(255) not null,
    underground boolean not null,
    primary key(id)
);

--Platform table, platforms may or may not relate to stations (bus platforms)
create table platform(
    id int not null auto_increment,
    name varchar(10) not null,
    station_id int,
    primary key(id),
    foreign key(station_id) references transit_station(id) on delete restrict
)

--System table, no foreign keys
create table system(
    id int not null auto_increment,
    name varchar(255) not null,
    url varchar(255) not null,
    primary key(id)
);

--Line table, relates to system and transit_type
create table line(
    id int not null auto_increment,
    name varchar(255) not null,
    transit_type_id int not null,
    system_id int not null, 
    primary key(id),
    foreign key(system_id) references system(id) on delete restrict,
    foreign key(transit_type_id) references transit_type(id) on delete restrict
);

--Many-to-many line-to-station table
create table line_station(
    id int not null auto_increment,
    line_id int not null,
    station_id int not null,
    primary key(id),
    unique(station_id, line_id),
    foreign key(line_id) references line(id) on delete cascade,
    foreign key(station_id) references transit_station(id) on delete cascade
);


line to station
line to transit type
line to system
platform to station


PLATFORM:
select id, name, underground from transit_station;

select platform.id, platform.name, case when station_id is NULL then -1 else station_id end as station_id,
case when transit_station.name is NULL then 'NULL' else transit_station.name end as station_name
from platform left join transit_station on platform.station_id = transit_station.id;

select platform.id, platform.name, case when station_id is NULL then -1 else station_id end as station_id,
case when transit_station.name is NULL then 'NULL' else transit_station.name end as station_name
from platform left join transit_station on platform.station_id = transit_station.id
where platform.name like '%[platformName]%'
and transit_station.name is NULL;

select platform.id, platform.name, case when station_id is NULL then -1 else station_id end as station_id,
case when transit_station.name is NULL then 'NULL' else transit_station.name end as station_name
from platform left join transit_station on platform.station_id = transit_station.id
where platform.name like '%[platformName]%'
and transit_station.name like '%[stationName]%';

select id, name, case when station_id is NULL then -1 else station_id end as station_id from platform where id=[platformInput];
insert into platform (name, station_id) values ([platformName],[stationInput]);
update platform set name=[platformName], station_id=[stationInput] where id=[platformInput];
delete from platform where id = [platformInput];


STATION:
select id, name, case when underground=1 then 'true' else 'false' end as underground from transit_station;
select id, name, underground from transit_station where id = [stationInput];
insert into transit_station (name, underground) values ([stationName],[undergroundInput]);
update transit_station set name=[stationName], underground=[undergroundInput] where id=[stationInput];
delete from transit_station where id = [stationInput];


SYSTEM:
select id, name, url from system;
select id,name,url from system where id = [systemInput];
insert into system (name, url) values ([systemName],[urlInput]);
update system set name=[systemName], url=[urlInput] where id=[systemInput];
delete from system where id = [systemInput];


TRANSIT TYPE:
select id, transit_type from transit_type;
select id, name, count(id) as fail_count from line where transit_type_id = [transitTypeInput];
select id, transit_type from transit_type where id = [transitTypeInput];
insert into transit_type (transit_type) value ([transitTypeName]);
update transit_type set transit_type=[transitTypeName] where id=[transitTypeInput];
delete from transit_type where id = [transitTypeInput];


LINE:
select id, transit_type from transit_type;
select id, name from system;

select line.id, line.name, transit_type.transit_type, system.name as system_name from line
join transit_type on line.transit_type_id = transit_type.id
join system on system.id = line.system_id;

select line.id, line.name, transit_type.transit_type, line.transit_type_id, system.name as system_name, line.system_id from line
join transit_type on line.transit_type_id = transit_type.id
join system on system.id = line.system_id where line.id=[lineInput];

insert into line (name, transit_type_id, system_id) values ([nameInput],[transitTypeInput],[systemInput]);
update line set name=[nameInput], transit_type_id=[transitTypeInput], system_id=[systemInput] where id=[lineInput];
delete from line where id = [lineInput];


LINE STATION:
select id, name, transit_type_id, system_id from line;
select id, name, underground from transit_station;

select line_station.id, line_id, line.name as line_name, station_id, transit_station.name as station_name
from line_station join line on line_station.line_id = line.id
join transit_station on line_station.station_id = transit_station.id;

select line_station.id, line_id, line.name as line_name, station_id, transit_station.name as station_name
from line_station join line on line_station.line_id = line.id
join transit_station on line_station.station_id = transit_station.id where line_station.id = [lineStationInput];

insert into line_station (line_id, station_id) values ([lineInput],[stationInput]);
update line_station set line_id=[lineInput], station_id=[stationInput] where id=[lineStationInput];
delete from line_station where id = [lineStationInput];




insert into transit_station(name,underground) values('Richmond',false);
insert into transit_station(name,underground) values('El Cerrito del Norte',false);
insert into transit_station(name,underground) values('North Berkeley',false);
insert into transit_station(name,underground) values('El Cerrito Plaze',false);
insert into transit_station(name,underground) values('Downtown Berkeley',true);
insert into transit_station(name,underground) values('Ashby',true);
insert into transit_station(name,underground) values('MacArthur',true);

insert into platform(name,station_id) values('Plat 1',1);
insert into platform(name,station_id) values('Plat 2',1);
insert into platform(name,station_id) values('Plat 1',2);
insert into platform(name,station_id) values('Plat 2',2);
insert into platform(name,station_id) values('Plat 1',3);
insert into platform(name,station_id) values('Plat 2',3);
insert into platform(name,station_id) values('Plat 1',4);
insert into platform(name,station_id) values('Plat 2',4);
insert into platform(name,station_id) values('Plat 1',5);
insert into platform(name,station_id) values('Plat 2',5);
insert into platform(name,station_id) values('Plat 1',6);
insert into platform(name,station_id) values('Plat 2',6);
insert into platform(name,station_id) values('Plat 1',7);
insert into platform(name,station_id) values('Plat 2',7);

insert into transit_station(name,underground) values('El Cerrito del Norte',false)
insert into transit_station(name,underground) values('North Berkeley',false)
insert into transit_station(name,underground) values('El Cerrito Plaze',false)
insert into transit_station(name,underground) values('Downtown Berkeley',true)
insert into transit_station(name,underground) values('Ashby',true)
insert into transit_station(name,underground) values('MacArthur',true)

insert into transit_type(transit_type) values('Bus');
insert into transit_type(transit_type) values('Rail');
insert into transit_type(transit_type) values('LightRail');
insert into transit_type(transit_type) values('Ferry');
insert into transit_type(transit_type) values('Tram');
insert into transit_type(transit_type) values('Subway');

insert into system(name,url) values('Bay Area Rapid Transit', 'https://www.bart.gov/');

insert into line(name,transit_type_id,system_id) values('Red',6,1);
insert into line(name,transit_type_id,system_id) values('Yellow',6,1);

insert into line_station(line_id, station_id) values(1, 1);
insert into line_station(line_id, station_id) values(1, 2);
insert into line_station(line_id, station_id) values(1, 3);
insert into line_station(line_id, station_id) values(1, 4);
insert into line_station(line_id, station_id) values(1, 5);
insert into line_station(line_id, station_id) values(1, 6);
insert into line_station(line_id, station_id) values(1, 7);
insert into line_station(line_id, station_id) values(2, 1);
insert into line_station(line_id, station_id) values(2, 2);
insert into line_station(line_id, station_id) values(2, 3);
insert into line_station(line_id, station_id) values(2, 4);
insert into line_station(line_id, station_id) values(2, 5);
insert into line_station(line_id, station_id) values(2, 6);
insert into line_station(line_id, station_id) values(2, 7);













