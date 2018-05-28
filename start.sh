docker build -t front .
docker stop front
docker rm front
rm -rf /var/www/fedorov.one/*
docker run --name=front --privileged=true  front
docker cp front:/usr/src/app/dist /var/www/fedorov.one/