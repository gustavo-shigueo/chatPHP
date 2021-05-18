FROM gitpod/workspace-full
RUN sudo apt-get update && sudo apt-get install -y tool && sudo rm -rf /var/lib/apt/lists/*
RUN sudo apt-get update
&& sudo apt-get install -y
tool
&& sudo rm -rf /var/lib/apt/lists/*

FROM gitpod/workspace-mysql 
FROM gitpod/workspace-mysql
