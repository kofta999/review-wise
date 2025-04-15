-- Insert test users for businesses (password is 12345678)
INSERT INTO "user" (email, password, role) VALUES
('bistro_owner@example.com', '$argon2id$v=19$m=65536,t=2,p=1$I7pM8iN3PZwe7mFIYS2bxggKDimr0ZlcfipPjO7Qe8o$2f7nEaJnKsyqdZOP2/0jmlPdZkbuQMPhGPi3jPl6034', 'BUSINESS'),
('cafe_owner@example.com', '$argon2id$v=19$m=65536,t=2,p=1$I7pM8iN3PZwe7mFIYS2bxggKDimr0ZlcfipPjO7Qe8o$2f7nEaJnKsyqdZOP2/0jmlPdZkbuQMPhGPi3jPl6034', 'BUSINESS');

-- Insert admins (password is 12345678)
INSERT INTO "user" (email, password, role) VALUES
('admin1@example.com', '$argon2id$v=19$m=65536,t=2,p=1$I7pM8iN3PZwe7mFIYS2bxggKDimr0ZlcfipPjO7Qe8o$2f7nEaJnKsyqdZOP2/0jmlPdZkbuQMPhGPi3jPl6034', 'ADMIN');

-- Insert test businesses
INSERT INTO "business" (user_id, name, description) VALUES
(1, 'Riverside Bistro', 'A cozy restaurant with riverside views and international cuisine'),
(2, 'Downtown Cafe', 'Modern cafe serving artisanal coffee and homemade pastries');

-- Insert reviewers
-- INSERT INTO "user" (email, password, role) VALUES
-- ('reviewer1@example.com', 'hashed_password_3', 'REVIEWER'),
-- ('reviewer2@example.com', 'hashed_password_4', 'REVIEWER'),
-- ('reviewer3@example.com', 'hashed_password_5', 'REVIEWER'),
-- ('reviewer4@example.com', 'hashed_password_6', 'REVIEWER');

-- Insert 20 reviews for Riverside Bistro (business_id = 1)
INSERT INTO "review" (business_id, rating, title, description) VALUES
(1, 5, 'Exceptional food', 'The steak was cooked to perfection, and the service was impeccable.'),
(1, 4, 'Lovely atmosphere', 'Great ambiance with the river view, but slightly overpriced.'),
(1, 5, 'Best dining experience', 'Everything from appetizers to desserts was amazing!'),
(1, 3, 'Good but slow service', 'Food was tasty but we had to wait too long.'),
(1, 4, 'Pleasant evening', 'Enjoyed the cocktails and river view. Food was good.'),
(1, 5, 'Outstanding cuisine', 'The chef''s special was remarkable, will definitely return.'),
(1, 4, 'Great date spot', 'Perfect place for a romantic dinner, beautiful setting.'),
(1, 3, 'Mixed feelings', 'Some dishes were excellent, others just average.'),
(1, 5, 'Fantastic flavors', 'The fusion cuisine really works here. Delicious!'),
(1, 4, 'Nice for family dinner', 'Kid-friendly but still sophisticated, good menu options.'),
(1, 5, 'Memorable experience', 'Celebrated our anniversary here and it was perfect.'),
(1, 2, 'Disappointing visit', 'Not up to the standard I expected for the price.'),
(1, 4, 'Solid choice', 'Reliable good food and friendly staff.'),
(1, 5, 'Exceptional seafood', 'The salmon dish was one of the best I''ve ever had.'),
(1, 3, 'Decent but noisy', 'Food was good but the acoustics made conversation difficult.'),
(1, 4, 'Great wine list', 'Impressive selection of wines that pair perfectly with the food.'),
(1, 5, 'Hidden gem', 'Can''t believe I hadn''t discovered this place sooner!'),
(1, 4, 'Good business lunch spot', 'Quick service and quality food make it perfect for meetings.'),
(1, 3, 'Average brunch', 'Nothing special but nothing to complain about either.'),
(1, 5, 'Brilliant desserts', 'Come for the main course, stay for the amazing desserts!');

-- Insert 20 reviews for Downtown Cafe (business_id = 2)
INSERT INTO "review" (business_id, rating, title, description) VALUES
(2, 5, 'Best coffee in town', 'Their espresso is unmatched. Perfect every time!'),
(2, 4, 'Great pastries', 'The croissants are flaky and delicious. Good coffee too.'),
(2, 5, 'Perfect work spot', 'Great wifi, quiet atmosphere, and excellent lattes.'),
(2, 3, 'Hit and miss', 'Some days the coffee is amazing, other days it''s just OK.'),
(2, 4, 'Lovely atmosphere', 'Modern decor and friendly baristas make this place special.'),
(2, 5, 'Amazing breakfast', 'The avocado toast and cappuccino combo is perfect.'),
(2, 4, 'Good meeting spot', 'Centrally located with good seating arrangements for meetings.'),
(2, 3, 'Too crowded', 'Good coffee but always packed and hard to find seating.'),
(2, 5, 'Outstanding service', 'The staff remembers regular customers and their orders!'),
(2, 4, 'Quality ingredients', 'You can taste the difference in their locally-sourced food.'),
(2, 5, 'Best scones ever', 'Their blueberry scones are worth the trip downtown.'),
(2, 3, 'Decent but pricey', 'Good quality but significantly more expensive than nearby cafes.'),
(2, 4, 'Charming place', 'Love the vibe and the seasonal drink specials.'),
(2, 5, 'Superior beans', 'They clearly care about their coffee sourcing. Exceptional flavors.'),
(2, 3, 'Inconsistent', 'Great when it''s good, but quality varies between visits.'),
(2, 4, 'Nice for casual meetings', 'Not too loud, good coffee, perfect for a business chat.'),
(2, 5, 'Exceptional baristas', 'The latte art alone is worth the visit!'),
(2, 4, 'Good study spot', 'Quiet corners and strong wifi make it perfect for studying.'),
(2, 3, 'Average cafe fare', 'Nothing stands out but satisfies the coffee craving.'),
(2, 5, 'Hidden downtown treasure', 'A peaceful oasis in the busy downtown area. Fantastic coffee!');
