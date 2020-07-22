const carType = [{
    value:'C',
    name:'小型车'
},{
    value:'B',
    name:'中型车'
},{
    value:'A',
    name:'大型车'
}];
function getCarType (code){
    let val = ''
    carType.map( item => {
        if(item.value == code) {
            val = item.name
        }
    })
    return val;
}
export {carType, getCarType};
