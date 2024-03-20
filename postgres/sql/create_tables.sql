CREATE DATABASE waitmanagementdb;

\c waitmanagementdb;

CREATE TABLE IF NOT EXISTS test (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS Restaurant (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    imagePath VARCHAR NOT NULL,
    comment TEXT
);

CREATE TABLE IF NOT EXISTS RestaurantTable (
    tableId INT NOT NULL,
    restaurantId INT NOT NULL,
    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurantId) REFERENCES Restaurant(id),
    CONSTRAINT pk_restaurant
        PRIMARY KEY (restaurantId, tableId)
);

CREATE TABLE IF NOT EXISTS Category (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    restaurantid INT NOT NULL,
    orderIndex VARCHAR NOT NULL,
    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurantid) REFERENCES Restaurant(id)
);

CREATE TABLE IF NOT EXISTS MenuItem (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    cost DECIMAL NOT NULL,
    imagePath VARCHAR(128),
    ingredients TEXT NOT NULL,
    orderIndex VARCHAR NOT NULL,
    categoryId INT,
    restaurantId INT,
    CONSTRAINT fk_category 
        FOREIGN KEY (categoryId) REFERENCES Category(id),
    CONSTRAINT fk_menu 
        FOREIGN KEY (restaurantId) REFERENCES Restaurant(id)
);

CREATE TABLE IF NOT EXISTS Users (
    email VARCHAR(128) PRIMARY KEY,
    firstName VARCHAR(128) NOT NULL,
    lastName VARCHAR(128) NOT NULL,
    imagePath VARCHAR(128) NOT NULL,
    hashedpassword VARCHAR(128) NOT NULL
);


CREATE TABLE IF NOT EXISTS Staff (
    email VARCHAR(128) NOT NULL,
    rolename VARCHAR(128) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (email) REFERENCES Users(email),
    CONSTRAINT ck_rolename
        CHECK (
            rolename = 'manager' OR
            rolename = 'kitchenstaff' OR
            rolename = 'waitstaff'
        ),
    CONSTRAINT pk_staff
        PRIMARY KEY (email, rolename)
    
);


CREATE TABLE IF NOT EXISTS Orders (
    id SERIAL PRIMARY KEY,
    tableId INT NOT NULL,
    restaurantId INT NOT NULL,
    comment VARCHAR(128),
    ordered_at TIMESTAMP,
    ordered_by VARCHAR(128),
    CONSTRAINT fk_userEmail
        FOREIGN KEY (ordered_by) REFERENCES Users(email),
    CONSTRAINT fk_tableId
        FOREIGN KEY (tableId, restaurantId) REFERENCES RestaurantTable(tableId, restaurantId),
    CONSTRAINT fk_restaurantid
        FOREIGN KEY (restaurantId) REFERENCES Restaurant(id)
);

CREATE TABLE IF NOT EXISTS OrderItem (
    orderId INT,
    menuItemId INT,
    quantity INT NOT NULL,
    orderstatus VARCHAR(128),
    CONSTRAINT ck_orderstatus
        CHECK (orderstatus = 'ready'
        OR orderstatus = 'pending'
        OR orderstatus = 'served'),
    CONSTRAINT fk_orderId
        FOREIGN KEY (orderId) REFERENCES Orders(id),
    CONSTRAINT fk_menuItemId
        FOREIGN KEY (menuItemId) REFERENCES MenuItem(id),
    CONSTRAINT pk_orderItem
        PRIMARY KEY (orderId, menuItemId)
);
CREATE TABLE IF NOT EXISTS Tag (
    id SERIAL PRIMARY KEY,
    tagName VARCHAR(64),
    colour VARCHAR(64)
);


CREATE TABLE IF NOT EXISTS RequestAssistance (
    requestId SERIAL PRIMARY KEY,
    restaurantId INT,
    tableId INT,
    requested_at TIMESTAMP,
    statusname VARCHAR(20),
    CONSTRAINT fk_table
        FOREIGN KEY (restaurantid, tableid) REFERENCES RestaurantTable(restaurantid, tableid),
    CONSTRAINT ck_status
        CHECK (
            statusname = 'requesting'
            OR statusname = 'satisfied'
        )
);

CREATE TABLE IF NOT EXISTS LoyaltyProgram (
    restaurantId INT PRIMARY KEY,
    minimum INT NOT NULL,
    discount INT NOT NULL, 
    multiplier INT NOT NULL,
    CONSTRAINT fk_restaurant
        FOREIGN KEY (restaurantId) REFERENCES Restaurant(id)
);

INSERT INTO Tag (tagName, colour) VALUES ('Vegetarian', '#a92307');
INSERT INTO Tag (tagName, colour) VALUES ('Vegan', '#d76480');
INSERT INTO Tag (tagName, colour) VALUES ('Pescetarian', '#cfeedf');
INSERT INTO Tag (tagName, colour) VALUES ('Dairy-Free', '#14f3c0');
INSERT INTO Tag (tagName, colour) VALUES ('Lactose-Free', '#1d13e2');
INSERT INTO Tag (tagName, colour) VALUES ('Gluten-Free', '#21785d');
INSERT INTO Tag (tagName, colour) VALUES ('Paleo', '#85b50d');
INSERT INTO Tag (tagName, colour) VALUES ('Halal', '#15ff33');
INSERT INTO Tag (tagName, colour) VALUES ('Nut-Free', '#e3f455');
INSERT INTO Tag (tagName, colour) VALUES ('Shellfish-Free', '#9f794c');
INSERT INTO Tag (tagName, colour) VALUES ('Kosher', '#905428');
INSERT INTO Tag (tagName, colour) VALUES ('Organic', '#f11dab');
