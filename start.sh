docker build -t front .
docker stop proxy
docker stop front
docker rm proxy
docker rm front
docker run -p 443:443 --net=host --privileged=true --restart=always --name=front -d front