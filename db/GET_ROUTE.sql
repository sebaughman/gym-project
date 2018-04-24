SELECT routes.*, AVG(stars) AS avg_stars, users.first_name as setters_name
FROM routes LEFT JOIN star_ratings 
      ON routes.id = star_ratings.route_id
JOIN users
    ON routes.setter_id = users.id
WHERE routes.id = $1
GROUP BY routes.id, users.first_name