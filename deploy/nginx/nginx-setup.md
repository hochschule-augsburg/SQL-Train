<!--
SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele

SPDX-License-Identifier: CC0-1.0
-->

# Setup nginx

## Install
```bash
sudo apt-get install nginx
systemctl start nginx.service
```

## Config

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
