.. _position:

Position: Application Django pour gpstracker
============================================

Application Django permettant de visualiser les données proposées par l'API REST du module gpstracker.
Ça aurait pu s'appeler django-gpstracker, mais on avait envie d'un nouveau nom.

Installation
------------

"position" doit se trouver dans le PYTHONPATH de l'utilisateur qui va lancer le projet Django qui va inclure l'application.

.. code-block:: bash

   $ git clone git@gitlab.blueline.mg:default/position.git
   /position$ python setup.py sdist
   /position$ pip install dist/position-"version".tar.gz --user

Utilisation dans un projet Django
---------------------------------

1. inclure "position" dans INSTALLED_APPS dans le fichier settings.py

2. rajouter une route dans urls.py pour accéder à l'application: include('position.urls')

3. lancer "./manage.py makemigration && ./manage.py migrate" pour inclure les modèles de l'application dans le projet

4. si vous avez apporté des modifications aux fichiers statiques de l'application, il est important de lancer "./manage.py collectstatic"
pour permettre à votre projet de voir les dites modifications

Mise à jour
-----------

Ci dessous un mini script de mise à jour (améliorable)

.. code-block:: bash

   cd position && git pull origin <branch> && python setup.py sdist && pip install dist/position-<version>.tar.gz --user --upgrade

Table des matières
------------------

.. toctree::
   :maxdepth: 3
   :glob:

   *
