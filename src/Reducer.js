
export default (state={}, action) => {
  switch (action.type) {
    case "set_car_details":
      if (action.data) {
        state.car_details = action.data;
      }
      return state;
    case "set_router_link":
      if (action.data) {
        state.rouer_link = action.data;
      }
      return state;
    case "set_router_name":
      if (action.data) {
        state.rouer_name = action.data;
      }
      return state;
    case "set_c_router_name":
      if (action.data) {
        state.c_rouer_link = action.data;
      }
      return state;
      case "get_router_link":
        console.log(state,'state')
        return state;
    default:
      return state;
  }
};