docker build -t front .
docker stop front
docker rm front
rm -rf /var/www/vi-hr.com/demo/*
docker run --name=front --privileged=true  front
docker cp front:/usr/src/app/dist/* /var/www/vi-hr.com/demo/