## Projektiopinnot

Käyttöliittymäosio projektiin, joka toteutettu Sveltellä. Käyttöönotto paikallisesti:

1. Luo `.env.local` tiedosto
2. Lisää seuraavat muuttujat arvoineen tiedostoon, jotka voi kaivella InfluxDB asetuksista
    ```
    VITE_API_TOKEN=<api_token>
    VITE_ORG_ID=<organistation_id>
    VITE_BUCKET=<bucket_id>
    ```
3. Aja komentolinjalla ensin komento `npm install`, jonka jälkeen `npm run dev`
4. Navigoi osoitteeseen http://localhost:5173