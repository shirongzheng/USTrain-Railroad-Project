# Clean and re-setup everything in database
# Ensure you ran `npm install` at ../ before running this file
all:
	sudo psql -U railroad_admin -d railroad -c "DROP OWNED BY current_user cascade;"
	sudo psql -U railroad_admin -d railroad < ../node_modules/connect-pg-simple/table.sql
	sudo psql -U railroad_admin -d railroad < setup_db.sql
	sudo psql -U railroad_admin -d railroad < postgres_functions/ensure_seats_free_set.sql
