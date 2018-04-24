select comments.*, users.image, users.first_name
from comments LEFT JOIN users
    on comments.user_id = users.id
where route_id = $1
ORDER BY comments.created_at