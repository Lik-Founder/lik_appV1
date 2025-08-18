-- Sample Data for Lik App
-- Run this SQL in your Supabase SQL Editor after setting up the main schema and storage

-- Insert sample restaurants
INSERT INTO restaurants (id, name, description, cuisine_type, address, latitude, longitude, rating, price_range, verified, cover_image_url, profile_image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Bella Italia', 'Authentic Italian cuisine in the heart of the city with handmade pasta and traditional recipes passed down through generations.', 'Italian', '123 Main St, San Francisco, CA 94102', 37.7749, -122.4194, 4.5, 3, true, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200'),
('550e8400-e29b-41d4-a716-446655440002', 'Sushi Zen', 'Fresh sushi and Japanese specialties with the finest ingredients flown in daily from Japan.', 'Japanese', '456 Ocean Ave, San Francisco, CA 94121', 37.7849, -122.4294, 4.8, 4, true, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=200'),
('550e8400-e29b-41d4-a716-446655440003', 'Taco Loco', 'Best tacos in town with authentic Mexican flavors and house-made salsas.', 'Mexican', '789 Mission St, San Francisco, CA 94103', 37.7649, -122.4394, 4.2, 2, false, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=200'),
('550e8400-e29b-41d4-a716-446655440004', 'Green Garden Cafe', 'Farm-to-table vegetarian and vegan options with organic ingredients.', 'Vegetarian', '321 Castro St, San Francisco, CA 94114', 37.7549, -122.4494, 4.3, 2, true, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=200'),
('550e8400-e29b-41d4-a716-446655440005', 'BBQ Central', 'Smoky barbecue with slow-cooked meats and homemade sides.', 'BBQ', '654 Valencia St, San Francisco, CA 94110', 37.7449, -122.4594, 4.6, 3, true, 'https://images.unsplash.com/photo-1558030006-450675393462?w=800', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=200');

-- Insert sample dishes
INSERT INTO dishes (id, restaurant_id, name, description, price, calories, category, image_url, ingredients, allergens, dietary_tags, rating) VALUES
-- Bella Italia dishes
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Margherita Pizza', 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and basil', 18.99, 650, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', ARRAY['tomatoes', 'mozzarella', 'basil', 'flour'], ARRAY['gluten', 'dairy'], ARRAY['vegetarian'], 4.7),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Fettuccine Alfredo', 'Creamy pasta with parmesan cheese and butter', 22.99, 820, 'Pasta', 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400', ARRAY['pasta', 'cream', 'parmesan', 'butter'], ARRAY['gluten', 'dairy'], ARRAY['vegetarian'], 4.5),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Truffle Risotto', 'Creamy arborio rice with black truffle and parmesan', 32.99, 650, 'Risotto', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400', ARRAY['arborio rice', 'truffle', 'parmesan', 'white wine'], ARRAY['dairy'], ARRAY['vegetarian', 'gluten-free'], 4.9),

-- Sushi Zen dishes
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'California Roll', 'Fresh crab, avocado, and cucumber with sesame seeds', 12.99, 320, 'Sushi', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', ARRAY['crab', 'avocado', 'cucumber', 'nori', 'rice'], ARRAY['shellfish'], ARRAY[], 4.4),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Salmon Sashimi', 'Fresh Atlantic salmon, 6 pieces', 16.99, 280, 'Sashimi', 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400', ARRAY['salmon'], ARRAY['fish'], ARRAY['gluten-free'], 4.8),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Dragon Roll', 'Eel and cucumber topped with avocado and eel sauce', 18.99, 380, 'Sushi', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', ARRAY['eel', 'cucumber', 'avocado', 'eel sauce'], ARRAY['fish'], ARRAY[], 4.6),

-- Taco Loco dishes
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', 'Fish Tacos', 'Grilled mahi-mahi with cabbage slaw and chipotle crema', 15.99, 450, 'Tacos', 'https://images.unsplash.com/photo-1565299585323-38174c8564bf?w=400', ARRAY['mahi-mahi', 'cabbage', 'lime', 'chipotle'], ARRAY['fish'], ARRAY[], 4.3),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', 'Carnitas Burrito', 'Slow-cooked pork with rice, beans, and fresh salsa', 13.99, 680, 'Burrito', 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', ARRAY['pork', 'rice', 'beans', 'salsa'], ARRAY[], ARRAY[], 4.1),

-- Green Garden Cafe dishes
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440004', 'Quinoa Buddha Bowl', 'Quinoa with roasted vegetables, avocado, and tahini dressing', 16.99, 520, 'Bowl', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', ARRAY['quinoa', 'sweet potato', 'broccoli', 'avocado', 'tahini'], ARRAY['sesame'], ARRAY['vegan', 'gluten-free'], 4.5),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440004', 'Impossible Burger', 'Plant-based patty with lettuce, tomato, and vegan mayo', 18.99, 580, 'Burger', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', ARRAY['impossible meat', 'lettuce', 'tomato', 'vegan mayo'], ARRAY[], ARRAY['vegan'], 4.2),

-- BBQ Central dishes
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'Brisket Platter', 'Slow-smoked brisket with coleslaw and cornbread', 24.99, 950, 'BBQ', 'https://images.unsplash.com/photo-1558030006-450675393462?w=400', ARRAY['beef brisket', 'cabbage', 'cornbread'], ARRAY['gluten'], ARRAY[], 4.7),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440005', 'Pulled Pork Sandwich', 'House-smoked pulled pork with BBQ sauce on brioche bun', 16.99, 720, 'Sandwich', 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400', ARRAY['pork', 'BBQ sauce', 'brioche bun'], ARRAY['gluten'], ARRAY[], 4.4);

-- Insert sample bounties
INSERT INTO bounties (id, restaurant_id, dish_id, title, description, reward_coins, reward_xp, difficulty, expires_at, requirements, active) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 'Truffle Experience', 'Order and review our signature truffle risotto', 150, 75, 'easy', NOW() + INTERVAL '30 days', '{"min_rating": 3, "photo_required": true}', true),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', NULL, 'Sushi Master Challenge', 'Try 5 different types of sushi in one visit', 300, 150, 'medium', NOW() + INTERVAL '14 days', '{"min_items": 5, "categories": ["sushi", "sashimi"]}', true),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440008', 'Spicy Challenge', 'Finish our spiciest burrito without drinking anything', 500, 250, 'hard', NOW() + INTERVAL '7 days', '{"time_limit": 600, "no_drinks": true}', true),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', NULL, 'Green Warrior', 'Try 3 vegan dishes and post about sustainability', 200, 100, 'easy', NOW() + INTERVAL '21 days', '{"min_items": 3, "hashtags": ["#vegan", "#sustainable"]}', true),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440011', 'BBQ Beast', 'Finish the entire brisket platter in under 20 minutes', 400, 200, 'expert', NOW() + INTERVAL '10 days', '{"time_limit": 1200, "finish_all": true}', true);

-- Insert sample quests
INSERT INTO quests (id, title, description, reward_coins, reward_xp, difficulty, expires_at, locations_required, quest_type, requirements, active) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Italian Food Tour', 'Visit 3 different Italian restaurants in the city', 350, 175, 'medium', NOW() + INTERVAL '30 days', 3, 'individual', '{"cuisine_type": "Italian", "min_spend": 15}', true),
('880e8400-e29b-41d4-a716-446655440002', 'Dessert Explorer', 'Try desserts from 5 different cuisines', 450, 225, 'medium', NOW() + INTERVAL '45 days', 5, 'individual', '{"category": "dessert", "different_cuisines": true}', true),
('880e8400-e29b-41d4-a716-446655440003', 'Night Market Adventure', 'Visit 4 food trucks after 8 PM', 250, 125, 'easy', NOW() + INTERVAL '14 days', 4, 'individual', '{"time_after": "20:00", "vendor_type": "food_truck"}', true),
('880e8400-e29b-41d4-a716-446655440004', 'Spice Route Challenge', 'Try spicy dishes from Asian cuisines', 300, 150, 'medium', NOW() + INTERVAL '20 days', 3, 'individual', '{"spice_level": "hot", "cuisines": ["Thai", "Indian", "Korean"]}', true),
('880e8400-e29b-41d4-a716-446655440005', 'Weekend Brunch Squad', 'Visit brunch spots with friends (team quest)', 200, 100, 'easy', NOW() + INTERVAL '7 days', 2, 'team', '{"meal_time": "brunch", "min_team_size": 2}', true);

-- Insert sample events
INSERT INTO events (id, title, description, image_url, location, latitude, longitude, start_date, end_date, price, tags, max_attendees, organizer_id) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'San Francisco Food Truck Festival', 'A celebration of the city''s best food trucks with live music and family activities', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', 'Golden Gate Park, San Francisco, CA', 37.7694, -122.4862, NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '8 hours', 15.00, ARRAY['food trucks', 'festival', 'family-friendly', 'live music'], 5000, NULL),
('990e8400-e29b-41d4-a716-446655440002', 'Mission District Taco Crawl', 'Guided tour of the best taquerias in the Mission District', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600', 'Mission District, San Francisco, CA', 37.7599, -122.4148, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', 35.00, ARRAY['tacos', 'guided tour', 'walking', '21+'], 20, NULL),
('990e8400-e29b-41d4-a716-446655440003', 'Wine & Dine Sunset Cruise', 'Luxury dining experience on the San Francisco Bay', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600', 'Fisherman''s Wharf, San Francisco, CA', 37.8080, -122.4177, NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '4 hours', 125.00, ARRAY['wine', 'cruise', 'luxury', 'sunset', '21+'], 100, NULL),
('990e8400-e29b-41d4-a716-446655440004', 'Chinatown Night Market', 'Evening market featuring authentic Chinese street food', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600', 'Chinatown, San Francisco, CA', 37.7943, -122.4078, NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '5 hours', 0.00, ARRAY['night market', 'chinese food', 'street food', 'free entry'], 2000, NULL),
('990e8400-e29b-41d4-a716-446655440005', 'Sustainable Food Summit', 'Conference on sustainable farming and eco-friendly dining', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600', 'Moscone Center, San Francisco, CA', 37.7849, -122.4018, NOW() + INTERVAL '25 days', NOW() + INTERVAL '26 days', 50.00, ARRAY['sustainability', 'conference', 'eco-friendly', 'networking'], 500, NULL);

-- Note: For posts, comments, likes, follows, and messages, these would typically be created by actual users
-- The above provides a good foundation of restaurant, dish, bounty, quest, and event data for testing