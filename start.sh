docker build -t front .
docker stop front
docker rm front
rm -rf /tmp/dist/*
docker run --name=front --privileged=true  front
docker cp front:/usr/src/app/dist /tmp 
mkdir -p /var/www/demo
cp -Rf /tmp/dist/* /var/www/demo/
echo hello