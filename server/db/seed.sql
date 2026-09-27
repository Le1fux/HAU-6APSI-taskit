-- Sample materials for development.
--
-- This starts with TRUNCATE. That is correct on your laptop and catastrophic
-- against the database your live demo depends on. Check which DATABASE_URL is
-- loaded before you run it.

TRUNCATE TABLE materials RESTART IDENTITY CASCADE;

INSERT INTO materials (title, content) VALUES
  ('Cellular respiration overview',
   'Cellular respiration is the process cells use to convert glucose into usable energy in the form of ATP. It occurs in stages, beginning with glycolysis in the cytoplasm and continuing with the Krebs cycle and electron transport chain in the mitochondria. The overall goal is to extract stored chemical energy from food and convert it into a form the cell can use for growth, movement, and repair.'),
  ('Photosynthesis key ideas',
   'Photosynthesis is the process by which plants capture light energy and use it to build glucose from carbon dioxide and water. This process takes place mostly in the chloroplasts, especially in the thylakoid membranes and stroma. It produces oxygen as a byproduct and stores energy in organic molecules that later support the plant and the rest of the food chain.'),
  ('Essay structure checklist',
   'A strong essay usually begins with a clear introduction that states the topic and thesis. Body paragraphs should each focus on one main point, backed by evidence and explanation, while transitions help the writing flow logically. The conclusion should restate the main argument and leave the reader with the key takeaway without introducing new information.');
