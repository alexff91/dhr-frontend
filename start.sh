docker build -t front .
docker stop front
docker rm front
docker run -p 80:8080 --privileged=true --restart=always --name=front -d front
