create table users (
    id int primary key auto_increment not null,
    username varchar(128) not null,
    password varchar(128) not null,
    balance decimal(19,2) not null,
    unique(username)
);

create table tickers (
    id int primary key auto_increment not null,
    symbol varchar(8) not null,
    price decimal(19,2) not null,
    key(symbol)
);

create table transactions (
    id int primary key auto_increment not null,
    tickerID int not null,
    type varchar(128) not null,
    shares int not null,
    amount decimal(19,2) not null,
    key(tickerID),
    constraint tickerID_fk foreign key (tickerID) references tickers (id)
);

