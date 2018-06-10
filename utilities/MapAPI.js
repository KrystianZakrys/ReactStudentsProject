var mapAPI = {
    getLocals(localization, radius){
        var temp = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=LOCALIZATION&radius=RADIUS&type=restaurant&key=AIzaSyAjzqwm143qvqKBEDizrJTeeSDauJSmpvA';
        var local = '53.118289%2C23.149720';
        var rad = '1500';

        var url = temp.replace("LOCALIZATION",local);
        url = url.replace("RADIUS",rad);
        
        return fetch(url).then((res)=> res.json());
    }
};

module.exports = mapAPI;