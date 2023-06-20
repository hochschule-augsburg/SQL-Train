-- SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
--
-- SPDX-License-Identifier: CC-BY-SA-4.0

-- ddl

CREATE TABLE working_model
(working_model  VARCHAR(30)     NOT NULL
,working_hours        INTEGER         NOT NULL
,CONSTRAINT     working_model_pk   PRIMARY KEY (working_model)
);

CREATE TABLE job_title
(job_title       VARCHAR(30)     NOT NULL
,salary         INTEGER         NOT NULL
,CONSTRAINT     job_title_pk     PRIMARY KEY (job_title)
);

CREATE TABLE employee 
(tax_nr       INTEGER         NOT NULL
,name           VARCHAR(30)     NOT NULL
,tel_nr      VARCHAR(15)         NOT NULL
,street        VARCHAR(30)     NOT NULL
,house_nr         VARCHAR(30)     NOT NULL
,post_code            INTEGER         NOT NULL
,city        VARCHAR(30)     NOT NULL
,working_model  VARCHAR(30)     NULL
,job            VARCHAR(30)     NOT NULL
,tax_class   INTEGER         NULL
,pizzeria       VARCHAR(30)     NOT NULL
,CONSTRAINT     emp_pk           PRIMARY KEY (tax_nr)
,CONSTRAINT     emp_u1           UNIQUE (name, tel_nr, street, house_nr, post_code, city)
,CONSTRAINT     emp_fk1          FOREIGN KEY (working_model)
                                    REFERENCES working_model (working_model)
,CONSTRAINT     emp_fk2          FOREIGN KEY (job)
                                    REFERENCES job_title (job_title)
,CONSTRAINT     emp_tax_class CHECK (tax_class in(1, 2, 3, 4, 5, 6))
);

CREATE TABLE client 
(name           VARCHAR(30)     NOT NULL
,tel_nr      VARCHAR(15)         NOT NULL
,street        VARCHAR(30)     NOT NULL
,house_nr         VARCHAR(30)     NOT NULL
,post_code            INTEGER         NOT NULL
,city        VARCHAR(30)     NOT NULL
,CONSTRAINT     client_pk        PRIMARY KEY (name, tel_nr, street, house_nr, post_code, city)
);

CREATE TABLE pizza_order
(client_name         VARCHAR(30)     NOT NULL
,client_tel_nr   VARCHAR(15)         NOT NULL
,client_street      VARCHAR(30)     NOT NULL
,client_house_nr       VARCHAR(30)     NOT NULL
,client_post_code          INTEGER         NOT NULL
,client_city      VARCHAR(30)     NOT NULL
,pizza_order_time        TIMESTAMP       NOT NULL
,pizza_order_option VARCHAR(30)     NOT NULL
,delivery_time       TIMESTAMP       NULL
,CONSTRAINT         pizza_order_pk         PRIMARY KEY (client_name, client_tel_nr, client_street,
                                     client_house_nr, client_post_code, client_city, pizza_order_time)
,CONSTRAINT         pizza_order_fk1        FOREIGN KEY (client_name, client_tel_nr, client_street,
                                     client_house_nr, client_post_code, client_city) 
                                    REFERENCES client (name, tel_nr, street, house_nr, post_code,
                                     city)
);

CREATE TABLE ingredient
(ingredient_name      VARCHAR(30)     NOT NULL
,ingredient_category VARCHAR(30)     NOT NULL
,CONSTRAINT     ingredient_pk        PRIMARY KEY (ingredient_name)
);

CREATE TABLE ingredient_exp_date
(ingredient_name      VARCHAR(30)     NOT NULL
,exp_date            TIMESTAMP       NOT NULL
,CONSTRAINT     ingredient_exp_date_pk     PRIMARY KEY (ingredient_name, exp_date)
,CONSTRAINT     ingredient_exp_date_fk1    FOREIGN KEY (ingredient_name)
                                    REFERENCES ingredient(ingredient_name)
);

CREATE TABLE store
(store_name      VARCHAR(30)     NOT NULL
,pizzeria       VARCHAR(30)     NOT NULL
,CONSTRAINT     store_pk        PRIMARY KEY (store_name)
);

CREATE Table store_ingredient
(ingredient_name      VARCHAR(30)         NOT NULL
,store_name      VARCHAR(30)         NOT NULL
,CONSTRAINT     store_ingredient_pk       PRIMARY KEY (ingredient_name, store_name)
,CONSTRAINT     store_ingredient_fk1      FOREIGN KEY (ingredient_name)
                                        REFERENCES ingredient(ingredient_name)
,CONSTRAINT     store_ingredient_fk2      FOREIGN KEY (store_name)
                                        REFERENCES store(store_name)
);

CREATE TABLE topping
(topping_name      VARCHAR(30)     NOT NULL
,topping_category VARCHAR(30)     NOT NULL
,CONSTRAINT     topping_pk        PRIMARY KEY (topping_name)
);

CREATE TABLE topping_ingredient
(topping_name      VARCHAR(30)        NOT NULL
,ingredient_name      VARCHAR(30)        NOT NULL
,CONSTRAINT     topping_ingredient_pk      PRIMARY KEY (topping_name, ingredient_name)
,CONSTRAINT     topping_ingredient_fk1     FOREIGN KEY (topping_name)
                                        REFERENCES topping(topping_name)
,CONSTRAINT     topping_ingredient_fk2     FOREIGN KEY (ingredient_name)
                                        REFERENCES ingredient(ingredient_name)
);

CREATE TABLE pizza
(size          VARCHAR(5)        NOT NULL
,topping_name      VARCHAR(30)         NOT NULL
,pizzeria       VARCHAR(30)         NOT NULL
,CONSTRAINT     pizza_pk            PRIMARY KEY (size, topping_name)
,CONSTRAINT     pizza_fk1           FOREIGN KEY (topping_name)
                                        REFERENCES topping(topping_name)
,CONSTRAINT     pizza_ck_size      CHECK (size in('S', 'M', 'L', 'XXL'))
);

CREATE TABLE pizza_order_pizza
(pizza_size         VARCHAR(5)            NOT NULL
,pizza_topping         VARCHAR(30)             NOT NULL
,client_name         VARCHAR(30)             NOT NULL
,client_tel_nr   VARCHAR(15)                 NOT NULL
,client_street       VARCHAR(30)            NOT NULL
,client_house_nr       VARCHAR(30)             NOT NULL
,client_post_code          INTEGER                 NOT NULL
,client_city      VARCHAR(30)             NOT NULL
,pizza_order_time        TIMESTAMP               NOT NULL
,CONSTRAINT         pizza_order_pizza_pk            PRIMARY KEY (pizza_size, pizza_topping, client_name,
                                             client_tel_nr, client_street, client_house_nr,
                                             client_post_code, client_city, pizza_order_time)
,CONSTRAINT         pizza_order_pizza_fk1           FOREIGN KEY (pizza_size, pizza_topping)
                                                REFERENCES pizza (size, topping_name)
,CONSTRAINT         pizza_order_pizza_fk2           FOREIGN KEY (client_name, client_tel_nr, client_street,
                                            client_house_nr, client_post_code, client_city, pizza_order_time)
                                                REFERENCES pizza_order (client_name, client_tel_nr, 
                                                 client_street, client_house_nr, client_post_code, client_city,
                                                pizza_order_time)
,CONSTRAINT         pizza_order_pizza_ck_size    CHECK (pizza_size in('S', 'M', 'L', 'XXL'))
);


-- dml

INSERT INTO job_title(job_title,salary)
VALUES('Pizza maker',2000);
INSERT INTO job_title(job_title,salary)
VALUES('Communikation',1000);
INSERT INTO job_title(job_title,salary)
VALUES('Pizza assembler',900);
INSERT INTO job_title(job_title,salary)
VALUES('Delivery',800);
INSERT INTO job_title(job_title,salary)
VALUES('Manager',10);

INSERT INTO working_model(working_model, working_hours)
VALUES  ('full-time', 40);
INSERT INTO working_model(working_model, working_hours)
VALUES  ('part-time', 20);
INSERT INTO working_model(working_model, working_hours)
VALUES  ('working student', 20);
INSERT INTO working_model(working_model, working_hours)
VALUES  ('intern', 35);

INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job, tax_class,pizzeria)
VALUES (1, 'Jill Safe', '5851561487', 'Dwight', '9572', '1805', 'Augsburg', 'full-time', 'Manager', 5, 'Raframini');
INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job,pizzeria)
VALUES (2, 'Joelynn MacCall', '5761216331', 'Logan', '1', '5507', 'Augsburg', 'intern', 'Delivery', 'Raframini');
INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job, tax_class,pizzeria)
VALUES (3, 'Martynne Christie', '2317462028', 'Autumn Leaf', '43', '6608', 'Augsburg', 'intern', 'Delivery', 4, 'Raframini');
INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job, tax_class,pizzeria)
VALUES (4, 'Rik Swanger', '5424162453', 'Meadow Ridge', '3', '86445', 'Augsburg', 'full-time', 'Pizza assembler', 4, 'Raframini');
INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job,pizzeria)
VALUES (5, 'Dorry Denisovo', '8713643313', 'Burning Wood', '66793', '46111', 'Augsburg', 'intern', 'Pizza assembler', 'Raframini');
INSERT INTO employee (tax_nr, name, tel_nr, street, house_nr, post_code, city, working_model, job, tax_class,pizzeria)
VALUES (6, 'Shepherd Filler', '1944117850', 'Nancy', '19546', '93828', 'Augsburg', 'full-time', 'Pizza maker', 2, 'Raframini');

INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg');
INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Olaf Bowie', '3557279332', 'Herman Strasse', '21', '86150', 'Augsburg');
INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Giacomo Filppetti', '1028267757', 'Jakobertor', '33', '86152', 'Augsburg');
INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Sara Warwick', '432251632', 'Augsburger Strasse', '14', '86161', 'Augsburg');
INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg');
INSERT INTO client (name, tel_nr, street, house_nr, post_code, city)
VALUES ('Esta Walduck', '9713370839', 'An Hochschule', '1', '86154', 'Augsburg');

INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option, delivery_time)
VALUES ('Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg', TIMESTAMP '2022-06-05 14:18:53', 'online', TIMESTAMP '2022-06-05 16:18:53');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option, delivery_time)
VALUES ('Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg', TIMESTAMP '2022-06-10 14:18:53', 'online', TIMESTAMP '2022-06-05 16:18:53');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option)
VALUES ('Olaf Bowie', '3557279332', 'Herman Strasse', '21', '86150', 'Augsburg', TIMESTAMP '2022-09-17 15:42:18', 'Ort');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option)
VALUES ('Giacomo Filppetti', '1028267757', 'Jakobertor', '33', '86152', 'Augsburg', TIMESTAMP '2022-03-20 03:51:36', 'by phone');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option)
VALUES ('Sara Warwick', '432251632', 'Augsburger Strasse', '14', '86161', 'Augsburg', TIMESTAMP '2021-05-17 06:42:02', 'online');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option)
VALUES ('Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg', TIMESTAMP '2021-02-18 01:34:01', 'Ort');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option) 
VALUES ('Esta Walduck', '9713370839', 'An Hochschule', '1', '86154', 'Augsburg', TIMESTAMP '2022-06-16 11:58:41', 'by phone');
INSERT INTO pizza_order(client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time, pizza_order_option) 
VALUES ('Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg', TIMESTAMP '2022-06-16 11:58:41', 'by phone');

INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Tomato', 'veggies');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Flour', 'grain');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Salami', 'sausage');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Ham', 'sausage');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Tuna', 'fish');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Pineapple', 'fruits');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Olive', 'Veggies');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Garlic', 'Veggies');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Mozzarella', 'cheese');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Gouda', 'cheese');
INSERT INTO ingredient(ingredient_name, ingredient_category)
VALUES ('Mushroom', 'Mushroom');

INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Tomato', TIMESTAMP '2022-07-26 08:08:27');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Flour', TIMESTAMP '2024-09-02 12:15:24');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Salami', TIMESTAMP '2022-07-09 07:18:41');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Ham', TIMESTAMP '2022-03-01 11:51:43');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Tuna', TIMESTAMP '2023-12-15 00:12:46');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Pineapple', TIMESTAMP '2022-11-04 18:23:19');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Olive', TIMESTAMP '2022-08-02 23:40:31');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Garlic', TIMESTAMP '2022-10-06 14:16:48');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Mozzarella', TIMESTAMP'2023-08-17 09:22:20');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Gouda', TIMESTAMP '2022-08-30 17:53:22');
INSERT INTO ingredient_exp_date (ingredient_name, exp_date)
VALUES ('Mushroom', TIMESTAMP '2025-12-07 01:51:57');

INSERT INTO store (store_name,pizzeria)
VALUES ('Rhynoodle', 'Raframini');
INSERT INTO store (store_name,pizzeria)
VALUES ('Youspan', 'Raframini');
INSERT INTO store (store_name,pizzeria)
VALUES ('Thoughtstorm', 'Raframini');
INSERT INTO store (store_name,pizzeria)
VALUES ('Avaveo', 'Raframini');

INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Tomato', 'Rhynoodle');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Flour', 'Rhynoodle');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Salami', 'Youspan');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Ham', 'Youspan');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Tuna', 'Thoughtstorm');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Pineapple', 'Avaveo');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Olive', 'Avaveo');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Garlic', 'Rhynoodle');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Mozzarella', 'Rhynoodle');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Gouda', 'Rhynoodle');
INSERT INTO store_ingredient(ingredient_name, store_name)
VALUES ('Mushroom', 'Youspan');

INSERT INTO topping(topping_name, topping_category)
VALUES  ('Margherita', 'vegetarian');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('Prosciutto', 'classic');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('Salami', 'classic');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('Funghi', 'vegetarian');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('with (almost) everything', 'exotic');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('Hawaii', 'exotic');
INSERT INTO topping(topping_name, topping_category)
VALUES  ('Tonno', 'exotic');

INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Margherita', 'Mozzarella');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Prosciutto', 'Ham');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Salami', 'Salami');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Funghi', 'Mushroom');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Hawaii', 'Pineapple');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Tonno', 'Tuna');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('with (almost) everything', 'Olive');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('with (almost) everything', 'Garlic');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('with (almost) everything', 'Flour');

INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Prosciutto', 'Mozzarella');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Salami', 'Mozzarella');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Funghi', 'Mozzarella');

INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Margherita', 'Tomato');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Prosciutto', 'Tomato');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Salami', 'Tomato');
INSERT INTO topping_ingredient(topping_name, ingredient_name)
VALUES  ('Funghi', 'Tomato');

INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','with (almost) everything','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Margherita','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Prosciutto','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Salami','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Funghi','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Tonno','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('S','Hawaii','Raframini');

INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','with (almost) everything','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Margherita','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Prosciutto','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Salami','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Funghi','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Tonno','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('M','Hawaii','Raframini');

INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','with (almost) everything','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Margherita','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Prosciutto','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Salami','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Funghi','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Tonno','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('L','Hawaii','Raframini');

INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','with (almost) everything','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Margherita','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Prosciutto','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Salami','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Funghi','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Tonno','Raframini');
INSERT INTO pizza(size,topping_name,pizzeria)
VALUES('XXL','Hawaii','Raframini');

INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('S', 'Salami', 'Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg', TIMESTAMP '2022-06-05 14:18:53');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('XXL', 'Salami', 'Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg', TIMESTAMP '2022-06-05 14:18:53');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('XXL', 'Salami', 'Peter Jo-ann Gowman', '1708534735', 'Maximilian Strasse', '18', '86161', 'Augsburg', TIMESTAMP '2022-06-10 14:18:53');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('L', 'Prosciutto', 'Olaf Bowie', '3557279332', 'Herman Strasse', '21', '86150', 'Augsburg', TIMESTAMP '2022-09-17 15:42:18');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('M', 'Funghi','Giacomo Filppetti', '1028267757', 'Jakobertor', '33', '86152', 'Augsburg', TIMESTAMP '2022-03-20 03:51:36');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('XXL', 'Margherita', 'Sara Warwick', '432251632', 'Augsburger Strasse', '14', '86161', 'Augsburg', TIMESTAMP '2021-05-17 06:42:02');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('XXL', 'Funghi', 'Sara Warwick', '432251632', 'Augsburger Strasse', '14', '86161', 'Augsburg', TIMESTAMP '2021-05-17 06:42:02');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('M', 'Salami','Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg', TIMESTAMP '2021-02-18 01:34:01');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time)
VALUES ('M', 'Margherita','Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg', TIMESTAMP '2022-06-16 11:58:41');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time) 
VALUES ('L', 'Salami', 'Esta Walduck', '9713370839', 'An Hochschule', '1', '86154', 'Augsburg', TIMESTAMP '2022-06-16 11:58:41');
INSERT INTO pizza_order_pizza(pizza_size, pizza_topping, client_name, client_tel_nr, client_street, client_house_nr, client_post_code, client_city, pizza_order_time) 
VALUES ('XXL', 'Funghi','Riccardo Giacovelli', '3853018727', 'Obere Alle', '178', '86157', 'Augsburg', TIMESTAMP '2022-06-16 11:58:41');