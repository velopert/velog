// TODO:

/* SELECT c.id, c.created_at, 'comment' AS type FROM comments AS c
WHERE fk_user_id = 'C76CCC50-B34D-11E8-B01F-598F1220D1C8'
UNION ALL SELECT p.id, p.created_at, 'like' AS type FROM post_likes AS p
WHERE fk_user_id = 'C76CCC50-B34D-11E8-B01F-598F1220D1C8'
ORDER BY created_at DESC */
