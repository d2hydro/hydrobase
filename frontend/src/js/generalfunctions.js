
 //write a function that converts lat/lon map coordinates to the Dutch RD new system
 export function WGS842RD(Lat, Lon) {
    let phiBesLambdaBes = WGS842BESSEL(Lat, Lon);
    let xy = BESSEL2RD(phiBesLambdaBes[0], phiBesLambdaBes[1]);
    return xy;
}

function WGS842BESSEL(PhiWGS, LamWGS) {
    let dphi, dlam, phicor, lamcor;

    dphi = PhiWGS - 52;
    dlam = LamWGS - 5;
    phicor = (-96.862 - dphi * 11.714 - dlam * 0.125) * 0.00001;
    lamcor = (dphi * 0.329 - 37.902 - dlam * 14.667) * 0.00001;
    let phi = PhiWGS - phicor;
    let lambda = LamWGS - lamcor;
    return [phi,lambda];
}

export function dynamicSort(property) {
    //this function sorts an array of objects by a given property
    //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    //usage: result = result.sort(dynamicSort("propertyname"));
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function BESSEL2RD(phiBes, lamBes){
    
    //converteert Lat/Long van een Bessel-functie naar X en Y in RD
    //code is geheel gebaseerd op de routines van Ejo Schrama's software:
    //schrama@geo.tudelft.nl
    let d_1, d_2, r, sa, ca, cpsi, spsi;
    let b, dl, w, q;
    let dq, phi, lambda, s2psihalf, cpsihalf, spsihalf;
    let tpsihalf;

    let x0 = 155000;
    let y0 = 463000;
    let k = 0.9999079;
    let bigr = 6382644.571;
    let m = 0.003773953832;
    let n = 1.00047585668;

    let pi = Math.PI;
    let lambda0 = pi * 0.0299313271611111;
    let b0 = pi * 0.289561651383333;

    let e = 0.08169683122;

    phi = phiBes / 180 * pi;
    lambda = lamBes / 180 * pi;
    q = Math.log(Math.tan(phi / 2 + pi / 4));
    dq = e / 2 * Math.log((e * Math.sin(phi) + 1) / (1 - e * Math.sin(phi)));
    q = q - dq;
    w = n * q + m;
    b = Math.atan(Math.pow(Math.exp(1), w)) * 2 - pi / 2;
    dl = n * (lambda - lambda0);
    d_1 = Math.sin((b - b0) / 2);
    d_2 = Math.sin(dl / 2);
    s2psihalf = d_1 * d_1 + d_2 * d_2 * Math.cos(b) * Math.cos(b0);
    cpsihalf = Math.sqrt(1 - s2psihalf);
    spsihalf = Math.sqrt(s2psihalf);
    tpsihalf = spsihalf / cpsihalf;
    spsi = spsihalf * 2 * cpsihalf;
    cpsi = 1 - s2psihalf * 2;
    sa = Math.sin(dl) * Math.cos(b) / spsi;
    ca = (Math.sin(b) - Math.sin(b0) * cpsi) / (Math.cos(b0) * spsi);
    r = k * 2 * bigr * tpsihalf;
    let X = Math.round(r * sa + x0);
    let Y = Math.round(r * ca + y0);
    return [X,Y];
}

export function getAngle(latLng1, latLng2, coef) {
    var dy = latLng2.lat - latLng1.lat;
    var dx = Math.cos(Math.PI / 180 * latLng1.lat) * (latLng2.lng - latLng1.lng);
    var ang = ((Math.atan2(dy, dx) / Math.PI) * 180 * coef);
    return (ang).toFixed(2);
}
