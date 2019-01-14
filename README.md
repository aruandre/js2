rakendus kasutab nodejs, mongodb, socketio ja bootstrapi raamistikke. 

git clone https://github.com/aruandre/js2.git
cd js2 ->> cd node_tut
npm install
käivita oma mongoDB

Rakenduse käivitamine:
käsureal: "npm start" või "nodemon"

ava browseris: http://localhost:3000

loo kasutaja, logi sisse, saad artikleid vaadata/luua/muuta/kustutada.
/crypto ->> küsitakse coinmarketcap API käest krüptovaluutade hindasid ja serveeritakse nimekirjana. saab filtreerida otsingu abil.
/chat ->> saab teateid saata, salvestatakse andmebaasi, saab kõik teated kustutada, edit/getall ei tööta
