#!/bin/bash
cp script.js index.html
live-server --port=8000 &
server_pid=$!
sleep 1
full_url="https://turbowarp.org/editor?extension=http://localhost:8000/script.js"
open "$full_url"
echo $full_url > .latest
trap "kill $server_pid" EXIT
wait

