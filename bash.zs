docker build --tag=bikeshed:latest .
docker run --rm -v $(pwd):/data <organization>/bikeshed:<date> bikeshed spec /data/<some *.bs file> [/data/<some output file>]
curl https://www.w3.org/publications/spec-generator/ -F file=@index.bs -F type=bikeshed-spec -F die-on=nothing > index.html
