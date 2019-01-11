git clone https://github.com/aruandre/js2.git

npm install
npm start

Rakenduse käivitamine:
käsureal käivita: "node app.js" või "nodemon"

ava browseris: http://localhost:3000

rakendus kasutab nodejs, mongodb, socketio ja bootstrapi raamistikke.
loo kasutaja, logi sisse, saad artikleid vaadata/luua/muuta/kustutada.
/crypto ->> küsitakse coinmarketcap API käest krüptovaluutade hindasid ja serveeritakse nimekirjana. saab filtreerida otsingu abil.
/chat ->> teateid saab saata, salvestatakse andmebaasi, saab kõik teated kustutada, edit/getall ei tööta
