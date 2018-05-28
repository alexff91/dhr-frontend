docker build -t front .
docker stop proxy
docker stop front
docker rm proxy
docker rm front
rm -rf /data/https-portal/vhosts/vi-hr.com/
docker run --name=front --privileged=true  front
docker cp front:/usr/src/app/dist /tmp/vi-hr.com/
rm -rf /data/https-portal/vhosts/vi-hr.com/*
cp -Rf /tmp/vi-hr.com/dist/* /data/https-portal/vhosts/vi-hr.com/
docker run -p 443:443 -p 80:80 -e DOMAINS='vi-hr.com' -v /data/https-portal/vhosts/:/var/www/vhosts --net=host --privileged=true --restart=always --name=proxy -d steveltn/https-portal