.. _position_models:

Modèles de données
==================

L'application propose un modèle de données nommé "Device".

Il est censé représenter un module de tracking GPS.

.. code-block:: python

   class Device(models.Model):
       imei = models.CharField(max_length=15, unique=True, primary_key=True)
       name = models.CharField(max_length=100, unique=True)
       phonenumber = models.CharField(max_length=20, unique=True)
       color = models.CharField(max_length=6, unique=True)
       description = models.TextField(max_length=100)


On indexe le modèle suivant `l'IMEI <https://fr.wikipedia.org/wiki/International_Mobile_Equipment_Identity>`_.
Grâce à ce modèle on peut ajouter de nouveaux modules, filtrer suivant le nom, l'IMEI, etc.
       
