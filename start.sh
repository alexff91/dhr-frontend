docker build -t front .
docker stop proxy
docker stop front
docker rm proxy
docker rm front
rm -rf /data/https-portal/vhosts/vi-hr.com/dist
docker run --name=front -v /data/https-portal/vhosts/vi-hr.com:/dist front
docker run -p 443:443 -p 80:80 -e DOMAINS='vi-hr.com' -v /data/https-portal/vhosts:/var/www/vhosts --net=host --privileged=true --restart=always --name=proxy -d steveltn/https-portal