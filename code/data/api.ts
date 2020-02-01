import axios from 'axios';
import citiesTest from './CitiesApiReqTest.json';

class Api {

    private _allCities:any[] = [];

    get allCities(): any[] {
        return this._allCities;
    }

    getSingleApiResponse(city:String, state:String, country:String) {
        let url: string = 'https://api.airvisual.com/v2/city?'+
            'city='+city+
            '&state='+state+
            '&country='+country+
            '&key=2fe3077d-98dd-4a19-b8e6-5eacaf614e36';
        axios.get(url).then((result) => {
            this._allCities.push(result);
        });
    }

    getApiData() {
        citiesTest.map(element => {
            this.getSingleApiResponse(element.city, element.state, element.country);
        });
    }
   
}

export {Api}