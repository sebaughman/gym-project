SELECT users_gyms.id, users_gyms.gym_id, gym_listings.name
FROM users_gyms JOIN gym_listings 
    ON users_gyms.gym_id = gym_listings.id
WHERE users_gyms.user_id = $1