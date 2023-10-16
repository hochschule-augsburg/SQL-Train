<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC-BY-SA-4.0
-->

# Deploy

## Get Started

### Setup nginx

#### Install
```bash
sudo apt-get install nginx
systemctl start nginx.service
```

#### Config

config file:
```bash
cp deploy/nginx/sql-training.conf /etc/nginx/sites-available/sql-training.example.com
cp deploy/nginx/proxy_params.conf /etc/nginx/proxy_params
```

activate config:
```bash
ln -s /etc/nginx/sites-available/sql-training.example.com /etc/nginx/sites-enabled/
systemctl restart nginx.service
```

### Firewall

#### Deactivate debian firewall

> ```bash
> systemctl stop arno-iptables-firewall
> systemctl disable arno-iptables-firewall
> ```

#### Firewall config Script 

1. Place config file
   ```bash
   cp deploy/iptables/rc.firewall /usr/local/bin/rc.firewall
   # make individual changes
   vi /usr/local/bin/rc.firewall
   chmod o+x /usr/local/bin/rc.firewall
   ```

2. Ensure persistent firewall rules
   ```bash
   cat << EOF >> /etc/network/if-pre-up.d/iptables
   #!/bin/sh
   /sbin/iptables-restore < /lib/iptables/rc.iptables
   EOF
   ```

3. Set Firewall rules and safe to /lib/iptables/rc.iptables

   > rc.firewall safe

### PostgreSQL

To setup the database for django choose a supported RDBMS (we recommend PostgreSQL) and set conninfo in `.env`.
See https://help.ubuntu.com/community/PostgreSQL for a tutorial.

### Docker

#### Auto Start on OS Boot via systemd file

```bash
cp deploy/systemd/docker-compose-app.service /etc/systemd/system/docker-compose-app.service
systemctl enable docker-compose-app
```

#### Manual Docker Startup:

```bash
# First set the environment variables from .env-example in .env
docker compose up --detach
```

### Initial configuration

```bash
docker exec -it django_container /bin/bash # open shell in container
python3 manage.py createsuperuser # Creates an admin user for the django admin page
python3 manage.py loaddata exercises_data/*.yaml # Due to copyright the exercises are not provided
```
### Firewall 

Disable arno iptables, set firewall manually
```bash
systemctl stop arno-iptables-firewall
systemctl disable arno-iptables-firewall
/usr/local/bin/rc.firewall save
```

## Update

```bash
git pull # get changes
git submodule update --recursive # Update the exercises_data submodule if you are part of THA
docker compose build # Watch out if you have enough space ;)
docker compose up -d
```
