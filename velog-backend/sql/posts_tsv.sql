alter table posts 
add column tsv tsvector;

create index posts_tsv on posts using gin(tsv);

update posts set tsv = to_tsvector(coalesce(title)) || to_tsvector(coalesce(body));

create or replace function posts_tsv_trigger() returns trigger as $$
begin
	new.tsv := to_tsvector(coalesce(new.title)) || to_tsvector(coalesce(new.body));
	return new;
end
$$ language plpgsql;


create trigger tsvectorupdate before insert or update on posts
for each row execute procedure posts_tsv_trigger();