export const setCarDetails =(value)=> {
    return {
        type: "set_car_details",
        data:value
    }
}
export const setRouterLink =(value)=> {
    
    return {
        type: "set_router_link",
        data:value
    }
}
export const getRouterLink =(value)=> {
    console.log(value)
    return {
        type: "get_router_link",
        data:value
    }
}
export const setRouterName =(value)=> {
    return {
        type: "set_router_name",
        data:value
    }
}
export const setCRouterName =(value)=> {
    return {
        type: "set_c_router_name",
        data:value
    }
}