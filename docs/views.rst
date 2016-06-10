.. _position_views:

Vues
====

L'application propose diverses vues pour interagir avec les données


Position: /<latitude>/<longitude>
---------------------------------

Cette vue toute simple permet d'afficher sur une carte un point correspondant aux coordonnées géographiques (latitude, longitude)
passées en parmètres via l'URI

.. _position_views_live:

Live tracking: /
----------------

La page d'accueil est une carte qui propose une couche sur laquelle sont dessinées les positions en temps
réel de chaque module inscrit dans la base de données.

Les positions sont récupérées via un code Javascript qui appelle à intervalle régulier l'API REST située à http://flicage.malagasy.com/api/gpstracker/

Les modules sont inscrits dans la colonne de gauche et indiquent chacun la couleur du point qui leur correspond sur la carte.
Chaque point est cliquable et affiche les informations de vitesse et heure dernièrement enregistrés.

Dans la même colonne de gauche, un formulaire permet de filtrer les modules par nom pour réduire la liste à un ou quelques modules.
La carte est mise à jour en conséquence pour rester cohérent avec la liste de modules filtrée.

En cliquant sur le nom d'un module dans la colonne de gauche, on accède à un formulaire qui propose de faire une recherche temporelle dans l'historique
de traces du module. Le résultat de cette requête est affiché sur la vue :ref:`_position_views_history`.

.. _position_views_history:

Historique de parcours: /
-------------------------

Cette vue attend en entrée un identifiant de module, une date et heure de début, une date et heure de fin.
Ces informations lui sont passées par l'intermédaire d'un formulaire disponible sur la vue :ref:`_position_views_live`.

Avec ces informations, cette vue appelle l'API REST située à http://flicage.malagasy.com/api/gpstracker/ et en récupère un document
GeoJSON lui donnant toutes les informations sur les différentes positions enregistrées dans l'intervalle de temps spécifié.

La vue va ainsi proposer le tracé du chemin parcouru par le module pendant cette période.
Deux marqueurs sur la carte, à chaque extrémité du chemin tracé, vont indiquer le départ et l'arrivée.

Dans la colonne de gauche on trouvera un bouton permettant de rejouer le tracé afin d'avoir une visualisation plus précise.
Cette même colonne liste tous les points significatifs du parcours: en cliquant sur l'un deux on obtient l'emplacement sur le trajet.
