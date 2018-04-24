SELECT routes.*, routes.id AS route_id, todos.id as todo_id, AVG(stars) as avg_stars, users.first_name AS setters_name
FROM routes 
JOIN todos
    ON routes.id = todos.route_id
JOIN users
    ON routes.setter_id = users.id
LEFT JOIN star_ratings
    ON routes.id = star_ratings.route_id
WHERE todos.user_id = $1 
Group By routes.id, todos.id, users.first_name