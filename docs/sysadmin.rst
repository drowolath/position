.. _position_sysadmin:

Documentation pour sysadmin
===========================

Dépendances applicatives
------------------------

L'application a besoin des modules suivant pour fonctionner:

* `Django 1.9 <https://docs.djangoproject.com/en/1.9/>`_
* `Redis 3.2 <http:redis.io>`_
* `Requests <http://docs.python-requests.org/en/master/>`_
* `redis-py <https://pypi.python.org/pypi/redis/>`_


Dépendances réseau
------------------

L'application puise ses informations d'une API REST qui pour le moment est située sur http://flicage.malagasy.com/api/gpstracker/.
Elle entretient un trafic HTTP important avec cette API.

L'API étant protégée par un jeton d'accès, l'application a besoin d'enregistrer son jeton pour utilisation jusqu'à expiration.
Le dit jeton est enregistré dans une base de données Redis.








  
