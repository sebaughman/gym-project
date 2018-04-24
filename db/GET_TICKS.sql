SELECT routes.*, routes.id AS route_id, ticks.id AS tick_id, AVG(stars) AS avg_stars, users.first_name AS setters_name
FROM routes 
JOIN ticks
    ON routes.id = ticks.route_id
JOIN users
     ON routes.setter_id = users.id
LEFT JOIN star_ratings
     ON routes.id = star_ratings.route_id
WHERE ticks.user_id = $1 
 GROUP BY routes.id, ticks.id, users.first_name