# position

Affiche sur une carte des coordonées GPS.
Utilisé aussi pour le live tracking de tracker GPS.

## Installation

position étant une application django, elle ne peut fonctionner qu'à l'intérieur d'un projet django.

Il faut toutefois, installer d'abord l'application pour qu'elle soit accessible dans le PYTHON PATH

```bash
$ git clone http://gitlab.blueline.mg/default/position.git
$ cd position
/position$ python setup.py sdist
/position$ sudo pip install dist/position-"version".tar.gz
```

Pour utiliser, vous devez ensuite:

1. Ajouter "position" à INSTALLED_APPS dans settings.py

2. Configurer le fichier urls.py du projet pour y inclure l'URL vers "position"

3. lancer "python manage.py migrate" pour inclure les modèles de l'application au projet

4. lancer "python manage.py collectstatic" pour récupérer les fichiers statiques propres à "position"

## Mise à jour

Si vous mettez à jour "position" et que vous voulez que celà se reflète dans votre projet l'utilisant,
il vous suffit de procéder comme suit:

```bash
/position$ git pull origin <branch>
/position$ python setup.py sdist
/position$ sudo pip uninstall position
/position$ sudo pip install dist/position-"version".tar.gz
```