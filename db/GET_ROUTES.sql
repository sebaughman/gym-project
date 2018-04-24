SELECT routes.*, AVG(stars) AS avg_stars, users.first_name AS setters_name
FROM routes LEFT JOIN star_ratings 
      ON routes.id = star_ratings.route_id
LEFT JOIN users
      ON setter_id = users.id
WHERE routes.gym_id = $1
GROUP BY routes.id, users.id