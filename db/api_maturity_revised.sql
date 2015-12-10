-- Creator:       MySQL Workbench 6.3.5/ExportSQLite Plugin 0.1.0
-- Author:        Gregory E. Hatt Jr.
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2015-12-10 19:20
-- Created:       2015-12-09 17:50
PRAGMA foreign_keys = OFF;

BEGIN;
CREATE TABLE "Category"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" VARCHAR(45) NOT NULL
);
INSERT INTO "Category"("id","name") VALUES(1, 'QA');
INSERT INTO "Category"("id","name") VALUES(2, 'SA');
CREATE TABLE "Group"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" VARCHAR(45)
);
CREATE TABLE "Form"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" VARCHAR(45) NOT NULL,
  CONSTRAINT "name_UNIQUE"
    UNIQUE("name")
);
INSERT INTO "Form"("id","name") VALUES(1, 'Business');
CREATE TABLE "Question"(
  "id" INTEGER NOT NULL,
  "text" VARCHAR(200),
  "category_id" INTEGER NOT NULL,
  "form_id" INTEGER NOT NULL,
  "group_id" INTEGER,
  PRIMARY KEY("id","category_id"),
  CONSTRAINT "fk_Question_Category"
    FOREIGN KEY("category_id")
    REFERENCES "Category"("id"),
  CONSTRAINT "fk_Question_Form1"
    FOREIGN KEY("form_id")
    REFERENCES "Form"("id"),
  CONSTRAINT "fk_Question_Grouping1"
    FOREIGN KEY("group_id")
    REFERENCES "Group"("id")
);
CREATE INDEX "Question.fk_Question_Category_idx" ON "Question" ("category_id");
CREATE INDEX "Question.fk_Question_Form1_idx" ON "Question" ("form_id");
CREATE INDEX "Question.fk_Question_Grouping1_idx" ON "Question" ("group_id");
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(1, 'Capture Business and Technical API measurements or metrics', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(2, 'Do you have Categories of Business and Technical API measurements or metrics', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(3, 'Capture KPIs that determine the business value of applications', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(4, 'Technology Investment in place for the development of APIs', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(5, 'Well defined teams for developing new applications', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(6, 'A prioritized list of future APIs has been budgeted', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(7, 'Clear owner of the Service API model/Service API catalog', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(8, 'Governance in place to monitor, manage, update, create enhanced capabilities of APIs', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(9, 'Defined group for the responsibility of managing API dependencies (internal and external)', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(10, 'New API functionality capabilities for the business with delivery roadmap', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(11, 'Legal issues are addressed with the API services (existing or new development)', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(12, 'New business API capabilities are planned for Mobile, Cloud, Analytics, and IOT', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(13, 'API capabilities are devliered to the Associate/Manager within a business store or branch location', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(14, 'API location dependencies and geofencing policies are in place', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(15, 'API are used to capture and deliver analytics to the managers or business associates', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(16, 'Business APIs are viewed by Executive Management as a way to grow the business (customer advocacy, improved effeciency, or new revenue', 1, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(17, 'Ad hoc', 2, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(18, 'Provider', 2, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(19, 'Consumer', 2, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(20, 'Business', 2, 1, NULL);
INSERT INTO "Question"("id","text","category_id","form_id","group_id") VALUES(21, 'Market', 2, 1, NULL);
CREATE TABLE "Client"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "name" VARCHAR(45) NOT NULL
);
INSERT INTO "Client"("id","name") VALUES(1, 'Sample Client');
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
INSERT INTO "Response"("id","response","value","category_id") VALUES(1, 'Don''t do it.', 0, 1);
INSERT INTO "Response"("id","response","value","category_id") VALUES(2, 'Planned', 1, 1);
INSERT INTO "Response"("id","response","value","category_id") VALUES(3, 'In Progress', 2, 1);
INSERT INTO "Response"("id","response","value","category_id") VALUES(4, 'Partially Implemented', 3, 1);
INSERT INTO "Response"("id","response","value","category_id") VALUES(5, 'Mature', 4, 1);
INSERT INTO "Response"("id","response","value","category_id") VALUES(6, 'Mature', 2, 2);
INSERT INTO "Response"("id","response","value","category_id") VALUES(7, 'Progressing', 1, 2);
INSERT INTO "Response"("id","response","value","category_id") VALUES(8, 'Novice', 0, 2);
CREATE TABLE "ClientQuestionResponse"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "response_id" INTEGER NOT NULL DEFAULT 1,
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
CREATE INDEX "ClientQuestionResponse.fk_ClientQuestionResponse_Response1_idx" ON "ClientQuestionResponse" ("response_id");
CREATE INDEX "ClientQuestionResponse.fk_ClientQuestionResponse_Question1_idx" ON "ClientQuestionResponse" ("question_id");
CREATE INDEX "ClientQuestionResponse.fk_ClientQuestionResponse_Client1_idx" ON "ClientQuestionResponse" ("client_id");
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(1, 1, 1, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(2, 1, 2, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(3, 1, 3, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(4, 1, 4, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(5, 1, 5, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(6, 1, 6, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(7, 1, 7, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(8, 1, 8, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(9, 1, 9, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(10, 1, 10, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(11, 1, 11, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(12, 1, 12, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(13, 1, 13, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(14, 1, 14, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(15, 1, 15, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(16, 1, 16, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(17, 8, 17, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(18, 8, 18, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(19, 8, 19, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(20, 8, 20, 1, 0);
INSERT INTO "ClientQuestionResponse"("id","response_id","question_id","client_id","weight") VALUES(21, 8, 21, 1, 0);
COMMIT;
