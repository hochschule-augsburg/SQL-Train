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
cp sql-training /etc/nginx/sites-available/sql-training.example.com
cp proxy_params /etc/nginx/ 
```

activate config:
```bash
ln -s /etc/nginx/sites-available/sql-training.examle.com /etc/nginx/sites-enabled/
systemctl restart nginx.service
```

### PostgreSQL

To setup the database for django choose a supported RDBMS (we recommend PostgreSQL) and set conninfo in `.env`.
See https://help.ubuntu.com/community/PostgreSQL for a tutorial.

### Docker

```bash
# Set the environment variables from .env-example in .env
docker compose up --detach
```

### Initial configuration

```bash
docker exec -it django_container /bin/bash # open shell in container
python3 manage.py createsuperuser # Creates an admin user for the django admin page
python3 manage.py loaddata exercises_data/*.yaml # Due to copyright the exercises are not provided
```

## Update

```bash
git pull # get changes
git submodule update --recursive # Update the exercises_data submodule if you are part of THA
docker-compose up -d
```
