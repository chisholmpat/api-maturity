-- Creator:       MySQL Workbench 6.3.5/ExportSQLite Plugin 0.1.0
-- Author:        Gregory E. Hatt Jr.
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2015-12-09 18:11
-- Created:       2015-12-09 17:50
PRAGMA foreign_keys = OFF;

CREATE TABLE "Category"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" VARCHAR(45) NOT NULL
);
CREATE TABLE "Form"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR(45) NOT NULL,
  CONSTRAINT "name_UNIQUE"
    UNIQUE("name")
);
CREATE TABLE "Question"(
  "id" INTEGER NOT NULL,
  "text" VARCHAR(45),
  "category_id" INTEGER NOT NULL,
  "form_id" INTEGER NOT NULL,
  PRIMARY KEY("id","category_id"),
  CONSTRAINT "fk_Question_Category"
    FOREIGN KEY("category_id")
    REFERENCES "Category"("id"),
  CONSTRAINT "fk_Question_Form1"
    FOREIGN KEY("form_id")
    REFERENCES "Form"("id")
);

CREATE TABLE "Client"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" VARCHAR(45) NOT NULL
);
CREATE TABLE "Response"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "response" VARCHAR(45),
  "value" INTEGER,
  "category_id" INTEGER NOT NULL,
  CONSTRAINT "fk_Response_Category1"
    FOREIGN KEY("category_id")
    REFERENCES "Category"("id")
);
CREATE INDEX "Response.fk_Response_Category1_idx" ON "Response" ("category_id");
CREATE TABLE "ClientQuestionResponse"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "response_id" INTEGER NOT NULL,
  "question_id" INTEGER NOT NULL,
  "client_id" INTEGER NOT NULL,
  "weight" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "fk_ClientQuestionResponse_Response1"
    FOREIGN KEY("response_id")
    REFERENCES "Response"("id"),
  CONSTRAINT "fk_ClientQuestionResponse_Question1"
    FOREIGN KEY("question_id")
    REFERENCES "Question"("id"),
  CONSTRAINT "fk_ClientQuestionResponse_Client1"
    FOREIGN KEY("client_id")
    REFERENCES "Client"("id")
);

COMMIT;
