var rect=require('./rectangle');
function solveRect(l,b) {
    console.log("Solving for rectangle l= "+l+" breadth b = "+b);

    if(l<=0 || b<=0) console.log("Not possible");
    else {
        console.log("Area of rect = "+ rect.area(l,b)); 
        console.log("Perimeter of rect = "+ rect.perimeter(l,b)); 
    }
}

solveRect(0,0);
solveRect(3,5);
solveRect(1,10);