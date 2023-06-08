# SPDX-FileCopyrightText: 2023 2023, Nicolas Bota, Marcel Geiger, Florian Paul, Rajbir Singh, Niklas Sirch, Jan Swiridow, Duc Minh Vu, Mike Wegele
#
# SPDX-License-Identifier: GPL-3.0-or-later

"""
This module provides a singleton class for managing PostgreSQL connection pools
"""
import logging
import threading
import time
from dataclasses import dataclass
from typing import Dict

import psycopg
from psycopg_pool import ConnectionPool

from ltiapi.models import LTIUser
from sql_training import settings

# import psycopg_c


@dataclass
class PoolItem:
    pool: ConnectionPool
    last_access: float


class PgConnPool:
    """
    Singleton class for managing PostgreSQL connection pools per user.
    """

    _instance = None  # typing when python 3.11 is on Debian
    _user_pools: Dict[str, PoolItem] = {}
    conninfo = lambda self, lms_username: (
        settings.PG_STUD_CONNINFO | {"user": lms_username, "dbname": lms_username}
        if settings.DEPLOY
        else settings.PG_TEST_CONNINFO
    )

    def __new__(cls):
        """Get Singleton."""
        if not cls._instance:
            cls._instance = super().__new__(cls)

            # Create Thread that clears the pools every 20 minutes
            def check(interval: int):
                while True:
                    time.sleep(interval)
                    cls._instance.close_unused_pools(interval)  # type: ignore

            threading.Thread(target=check, kwargs={"interval": 10}).start()
        return cls._instance

    def get_pool(self, user: LTIUser) -> ConnectionPool:
        """Returns ConnectionPool for given user. Creates one if it does not exist"""
        conninfo = self.conninfo(user.lms_username)
        if user.lms_username not in self._user_pools:
            new_pool = ConnectionPool(
                min_size=1, max_size=3, timeout=5, kwargs=conninfo
            )
            # check initial pool health
            with new_pool.connection():
                pass
            self._user_pools[user.lms_username] = PoolItem(new_pool, time.time())
        else:
            self._user_pools[user.lms_username].last_access = time.time()
        return self._user_pools[user.lms_username].pool

    def close_unused_pools(self, stale_time=1200):
        """Closes pools open longer than stale_time.
        If not called the pools would never be closed"""
        logging.info("closing old pools")
        keys = list(self._user_pools.keys())
        for key in keys:
            if self._user_pools[key].last_access < (time.time() - stale_time):
                self._user_pools[key].pool.close()
                self._user_pools.pop(key)
