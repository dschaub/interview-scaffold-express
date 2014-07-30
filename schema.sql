create table boards (
    id int primary key auto_increment not null,
    open bit not null default 1
);

create table players (
    id int primary key auto_increment not null,
    name varchar(128) default null
);

create table moves (
    id int primary key auto_increment not null,
    boardId int not null,
    playerId int not null,
    index(boardId),
    index(playerId)
);

create table board_players (
    playerId int not null,
    boardId int not null,
    side varchar(1) not null,
    primary key (playerId, boardId)
);
