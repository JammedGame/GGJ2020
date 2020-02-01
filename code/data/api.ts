import axios from 'axios';

class Api {
    getApiData(city:String, state:String, country:String) {
        let url: string = 'https://api.airvisual.com/v2/city?'+
            'city='+city+
            '&state='+state+
            '&country='+country+
            '&key=2fe3077d-98dd-4a19-b8e6-5eacaf614e36';
        axios.get(url).then((result) => {
            return result.data;
        });
    }
}

export {Api}