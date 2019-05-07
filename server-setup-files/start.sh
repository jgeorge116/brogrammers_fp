#!/bin/bash
sudo apt update
sudo apt install -y ansible
sudo apt install -y mongodb
sudo cp ~/brogrammers_fp/server-setup-files/hosts /etc/
ansible-playbook launch-backend.yml
