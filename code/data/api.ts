import axios from 'axios';
import citiesTest from './CitiesApiReqTest.json';
import scrapedData from './ScrapedData.json';
import { Log } from '../util/log';

class Api {

    private _allCities:any[] = [];

    private _apiKeys:String[] = [
        '69c53d22-d5dd-415c-9dde-c20f9729cc66',//'3fb98c43-56ef-4779-8e91-31b74f07dacd',
        'ba24528d-1e9b-48ed-94ee-28157ef29af7',//'69c53d22-d5dd-415c-9dde-c20f9729cc66',
        'ca950887-5086-4f54-a7ec-d8fdb73b6f4b',
        '17b8dc77-8b78-4957-a2cf-4c93abb88c0b',
        '57c443f5-6513-4d6c-b904-bf005211e22d',
        '5da54936-8643-4f72-9bfa-40457b8f04f9',
        '875e433f-0d3b-4145-bc0f-256573e0affd',
        'fc3927c3-b55e-437e-8dc0-32317e5da4c2',
        '24b8ddbd-ecc7-4959-986b-db664c5f7aec',
        'e95587f1-6edc-40e0-8d66-060f59b0dcfb',
        '5f08dc55-5ce1-4a9b-be13-ad3ceec6febb',
        '35b454ae-7d84-4596-bbc9-91ade4b51135',
        'fdb72764-b084-491f-b629-f7836cbaadf9',//'6b95eccd-8b53-475d-a620-dc64b09b7c4d'
        '03fa7963-a9dc-42f2-80b3-db2bc75aa6af',//'35f5ed59-1be2-4451-badf-958e51cf57b4'
        '0363c7d6-01ff-422d-ac02-548d3a1552e4'

    ];

    get allCities(): any[] {
        return this._allCities;
    }

    getSingleApiResponse(city:String, state:String, country:String, apiKey:String) {
        let url: string = 'https://api.airvisual.com/v2/city?'+
            'city='+city+
            '&state='+state+
            '&country='+country+
            '&key='+apiKey;
        axios.get(url).then((result) => {
            this._allCities.push(result);
        }).catch(error => Log.error(error));
    }

    getApiData() {

        let apiKeyCounter:number = 0;

        citiesTest.Cities.map(element => {
            if(apiKeyCounter<5) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[0]);
            } else if(apiKeyCounter>=5 && apiKeyCounter<10) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[1]);
            } else if(apiKeyCounter>=10 && apiKeyCounter<15) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[2]);
            } else if(apiKeyCounter>=15 && apiKeyCounter<20) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[3]);
            } else if(apiKeyCounter>=20 && apiKeyCounter<25) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[4]);
            } else if(apiKeyCounter>=25 && apiKeyCounter<30) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[5]);
            } else if(apiKeyCounter>=30 && apiKeyCounter<35) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[6]);
            } else if(apiKeyCounter>=35 && apiKeyCounter<40) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[7]);
            } else if(apiKeyCounter>=40 && apiKeyCounter<45) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[8]);
            } else if(apiKeyCounter>=45 && apiKeyCounter<50) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[9]);
            } else if(apiKeyCounter>=50 && apiKeyCounter<55) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[10]);
            } else if(apiKeyCounter>=55 && apiKeyCounter<60) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[11]);
            } else if(apiKeyCounter>=60 && apiKeyCounter<65) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[12]);
            } else if(apiKeyCounter>=65 && apiKeyCounter<70) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[13]);
            } else if(apiKeyCounter>=70 && apiKeyCounter<75) {
                this.getSingleApiResponse(element.city, element.state, element.country, this._apiKeys[14]);
            }
            apiKeyCounter++;
        });
    }

    setScrapedData() {
        this._allCities = scrapedData;
    }
   
}

export {Api}