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

insert into tickers (symbol, price) values
    ('AAPL', 100.96),
    ('FB', 77.81),
    ('IBM', 194.00),
    ('GOOG', 596.08),
    ('MSFT', 47.52),
    ('AMZN', 331.32),
    ('CMG', 664.09);

create table transactions (
    id int primary key auto_increment not null,
    userID int not null,
    tickerID int not null,
    type varchar(128) not null,
    shares int not null,
    amount decimal(19,2) not null,
    key(userID),
    key(tickerID),
    constraint userID_fk foreign key (userID) references users (id),
    constraint tickerID_fk foreign key (tickerID) references tickers (id)
);
