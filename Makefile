build_db:
	docker run -p 27017:27017 --name mongo-mall -d mongo

build_db_auth:
	docker run -p 27017:27017 --name mongo-mall -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d mongo