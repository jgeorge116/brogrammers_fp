#!/bin/bash
sudo apt update
sudo apt install -y ansible
sudo apt install -y mongodb
sudo cp ~/brogrammers_fp/server-setup-files/hosts /etc/
ansible-playbook launch-backend.yml
sudo cp ~/brogrammers_fp/server-setup-files/brogrammers_nginx /etc/nginx/sites-available
sudo ln -s /etc/nginx/sites-available/brogrammers_nginx /etc/nginx/sites-enabled
sudo rm /etc/nginx/sites-enabled/default
sudo systemctl restart nginx
