-- SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
--
-- SPDX-License-Identifier: CC-BY-SA-4.0

-- ddl

CREATE TABLE photo
(photo          VARCHAR(10)     NOT NULL
,title          VARCHAR(20)     NOT NULL
,date           DATE            NOT NULL
,source         VARCHAR(5)      NOT NULL
,type           VARCHAR(3)      NOT NULL
,height         INTEGER         NOT NULL
,width          INTEGER         NOT NULL
,CONSTRAINT     photo_pk   PRIMARY KEY (photo)
);

-- dml
INSERT INTO photo(photo, title, date, source, type, height, width)
VALUES ('nb02', 'Example 1', TO_DATE('20.03.05', 'DD.MM.YY'), 'Mar', 'tif', 360, 240);
INSERT INTO photo(photo, title, date, source, type, height, width)
VALUES ('nb01', 'Example 2', TO_DATE('20.03.05', 'DD.MM.YY'), 'Mit', 'tif', 360, 240);
INSERT INTO photo(photo, title, date, source, type, height, width)
VALUES ('neu_1', 'Example 3', TO_DATE('17.02.06', 'DD.MM.YY'), 'Sch', 'jpg', 450, 300);
INSERT INTO photo(photo, title, date, source, type, height, width)
VALUES ('nb11', 'Example 4', TO_DATE('01.07.06', 'DD.MM.YY'), 'Mit', 'tif', 360, 260);
INSERT INTO photo(photo, title, date, source, type, height, width)
VALUES ('stgl', 'Example 5', TO_DATE('27.12.06', 'DD.MM.YY'), 'Bin', 'tif', 360, 240);