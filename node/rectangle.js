/* A simple node module is created */


/* Callbacks takes two paramater 1st is the error or success and the value should be return. */
/* In secound Callback we send value as object contain two functions. */
/* In set timout funtion we use to call the callback and time to delay the callback. */


module.exports = (x,y,callback) => {
    if (x <= 0 || y <= 0)
        setTimeout(() => 
            callback(new Error("Rectangle dimensions should be greater than zero: l = "
                + x + ", and b = " + y), 
            null),
            2000);
    else
        setTimeout(() => 
            callback(null, {
                perimeter: () => (2*(x+y)),
                area:() => (x*y)
            }), 
            2000);
}