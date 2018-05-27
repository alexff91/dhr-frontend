docker build -t front .
docker stop front
docker rm front
docker run -p 5443:8080 --privileged=true --restart=always --name=front -d front
docker run -p 80:80 -p 443:443 -d --link="front"--restart=always -e "DOMAINS:'videointerview.online'" steveltn/https-portal:1
