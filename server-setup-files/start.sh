#!/bin/bash
sudo apt update
sudo apt install -y ansible
sudo apt install -y mongodb
ansible-playbook launch-backend.yml
