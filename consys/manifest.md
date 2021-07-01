# ConSys - Container System

## Was ist ConSys?

ConSys ist eine Bibliothek, die es ermöglichen soll,
Container-Layouts zu erschaffen und ggfs. zu verändern.

## Wie funktioniert es?

Die Container basieren auf verschachtelten Tabellen.
Ein vertikal unterteilter Container
<table>
<tr><td>child</td></tr>
<tr><td>child</td></tr>
</table>

Ein horizontal unterteilter Container
<table>
<tr><td>child</td><td>child</td></tr>
</table>

child ist dann entweder eine neue Tabelle oder direkt der Content.

## Steuerung

Was muss das System können?

* erstellen eines ContainerSystems
  -> Deklaration von
    * Name (id)
    * Orientierung ('row'/'column')
    * Children (wenn vorhanden)
    * Tab-Gruppe
    * relative Größe
      eines Containers
* zugreifen auf einen Container
  * via id
* abfragen eines Containers
  * Nachbarn (.next(), .up(), .children(), .tab())
  * Wände (entsprechender parent gesucht)
  * position und absolute Größe
  * absolute position zu relative größe
  * referenz zu html-element
* bearbeiten eines Containers
  * relative Größe
  * switch zu Eintrag in Tab-Gruppe
* verschieben eines Containers
  -> Zielangabe bestehend aus
    * anderem Container
    * Nachbarschaftsangabe ('up', 'left', 'right', 'down', 'tab')

## Objekte
