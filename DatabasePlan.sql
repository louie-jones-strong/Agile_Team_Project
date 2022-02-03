
DROP DATABASE WellTimed;


CREATE DATABASE WellTimed;
USE WellTimed;

CREATE TABLE Users(
	UserID INT AUTO_INCREMENT NOT NULL,
	Username VARCHAR(50) NOT NULL UNIQUE,
	JoinedDateTime DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	LastModifiedDateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,

	PRIMARY KEY (UserID)
	);


CREATE TABLE Events(
	EventID INT AUTO_INCREMENT NOT NULL,
	CreatedDateTime DATETIME DEFAULT CURRENT_TIMESTAMP  NOT NULL,
	LastModifiedDateTime DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,

	EventName VARCHAR(50) NOT NULL,
	EventDateTime DATETIME NOT NULL,
	EventCreator INT NOT NULL,

	EventDescription VARCHAR(240),
	EventDuration FLOAT, -- NULL for all day event

	PRIMARY KEY (EventID),
	FOREIGN KEY (EventCreator) REFERENCES Users(UserID)
	);

CREATE TABLE EventAttendees(
	AttendeesID INT AUTO_INCREMENT NOT NULL,
	UserID INT NOT NULL,
	EventID INT NOT NULL,

	PRIMARY KEY (AttendeesID),
	FOREIGN KEY (UserID) REFERENCES Users(UserID),
	FOREIGN KEY (EventID) REFERENCES Events(EventID)
	);


SHOW TABLES;
DESCRIBE Users;
DESCRIBE Events;
DESCRIBE EventAttendees;



INSERT INTO Users (Username)VALUES('Louie');
INSERT INTO Users (Username)VALUES('Randy');

-- meeting hosted by louie with randy attending
INSERT INTO Events (EventName, EventDateTime, EventCreator)VALUES('Test Meeting', '20120618', 1);

INSERT INTO EventAttendees (EventID, UserID)VALUES(1, 1);
INSERT INTO EventAttendees (EventID, UserID)VALUES(1, 2);

-- meeting hosted by randy with louie attending
INSERT INTO Events (EventName, EventDateTime, EventCreator)VALUES('Test Meeting', '20120618', 2);

-- INSERT INTO EventAttendees (EventID, UserID)VALUES(2, 2);
INSERT INTO EventAttendees (EventID, UserID)VALUES(2, 1);

SELECT * FROM Users;
SELECT * FROM Events;
SELECT * FROM EventAttendees;


SELECT EventName, EventDateTime, EventCreator, EventDuration FROM Events WHERE EventID IN (
	SELECT EventID FROM EventAttendees WHERE UserID=1
) OR EventCreator=1;