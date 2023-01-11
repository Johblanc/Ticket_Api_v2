# Ticket Api

## MVC

Afin d'améliorer la maintenance et l'organisation du code, il est possible de diviser le code en plusieurs partie.

En MVC, on sépare le code en 3 parties distincts :

. Une partie Model qui permet de traiter les interactions avec la base de données.

. Une partie Vue correspondant à l'interface utilisateur.

. Une partie Contrôleur permettant de le dialogue entre les deux parties précedentes. C'est également dans cette partie que la logique ce trouve (hors liaison base de données)

La liaison entre le Modele et le Contôleur peut se faire dans les deux sens. Le Contrôleur effectue des requetes au Model qui répond avec les données souhaitées

Les autres liaison sont unilateral :

. Utilisateur => Contrôleur : Les Actions de l'Utilisateur sont envoyé au Contrôleur qui les transforme et les transmet soit à la Vue, soit au Modèle

. Contrôleur => Vue : Le Contôleur informe la Vue des changement de données afin de remettre à jour l'interface.

. Vue => Utilisateur : C'est l'interface Utilisateur


## DOC

### Users

#### GET :
 
```/api/users```

Recupération des Users

### Tickets

#### GET :
 
```/api/tickets```

Récupération des Tickets
 
```/api/tickets/{id}```

Récupération d'un Ticket avec son id

#### POST 
 
```/api/tickets```

Création d'un Ticket

body : ```{ message : string , user_id : number }```

#### PUT 
 
```/api/tickets```

Modification d'un Ticket

body : ```{ id : number , message : string , done : boolean }```

body : ```{ id : number , message : string }```

body : ```{ id : number , done : boolean }```

#### DELETE 
 
```/api/tickets/{id}```

Suppression d'un Ticket




