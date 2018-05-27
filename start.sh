docker build -t front .
docker stop proxy
docker stop front
docker rm proxy
docker rm front
docker run -p 5443:8080 --privileged=true --restart=always --name=front -d front
docker run -p 80:80 -p 443:443 -d --link="front" --name=proxy --restart=always -e "DOMAINS:'videointerview.online -> http://localhost:5443'" steveltn/https-portal:1
