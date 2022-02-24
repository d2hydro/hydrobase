# HydroBase

Hydrobase is een full-stack webapplicatie die hydrologen ondersteunt bij het semi-automatisch bouwen van hydrologische en hydraulische modelschematisaties en het visueel beoordelen van omgevingsdata. 
De service ontsluit daartoe gegevens uit diverse bronnen, toont ze in onderlinge samenhang en biedt ze aan ter download. 
In eerste aanleg werd Hydrobase ontworpen om de data klaar te zetten voor het vervaardigen van WFlow-modellen, maar de ambitie is om spoedig ondersteuning voor andere modelcodes toe te voegen. De backend is geschreven in Python; de front-end in React.

Hydrobase wordt ontwikkeld door **D2Hydro** (Daniel Tollenaar) en **Hydroconsult** (Siebe Bosch) in partnerschap met **Hoogheemraadschap De Stichtse Rijnlanden** in Houten. 

## gebruik en vooruitgang ##
De code in deze repository is vrij beschikbaar op een MIT open source licentie. De code is as-is; de gebruiker kan geen aanspraak maken op beheer en onderhoud.

Bijdragen via een *fork* en en *merge request* worden zeer gewaardeerd en zullen we, wanneer mogelijk, zeker meenemen in toekomstige ontwikkelingen.

## private keys
De front-end maakt gebruik van een licentie op de Google Maps API (https://maps.googleapis.com/maps/api/js). Hiermee worden plaatsnamen opgezocht. Omdat deze licentie niet openbaar mag worden gemaakt is onze eigen private key opgeslagen in een bestand genaamd privatekeys.js en opgenomen in .gitignore. Iedere developer moet zijn/haar eigen private key bij Google aanvragen, dit bestand aanmaken en de key daarin wegschrijven. Het bestand moet worden geplaatst in de root van de frontend naast index.html. De key kan hierin worden geschreven als window.GOOGLEAPIKEY = "mykey";

Enjoy!

Vriendelijke groet,

Daniel Tollenaar en Siebe Bosch
