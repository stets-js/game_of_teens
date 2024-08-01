import {jwtDecode} from 'jwt-decode';

const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    role: 0,
    roleName: '',
    id: null,
    subscribedTo: [],
    registered: null
  },
  token: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const decodedToken = jwtDecode(action.payload.token);
      console.log(decodedToken);
      return {
        ...state,
        isAuthenticated: true,
        user: {
          name: decodedToken.name,
          role: decodedToken.role,
          roleName: decodedToken.roleName,
          id: decodedToken.id,
          subscribedTo: decodedToken.subscribedTo,
          registered: decodedToken.register
        },
        token: action.payload.token
      };
    case 'LOGOUT':
      localStorage.removeItem('got');
      return initialState;
    case 'CHANGE_SUBSCRIBED_TO':
      return {...state, user: {...state.user, subscribedTo: action.payload}};
    default:
      return state;
  }
};

export default authReducer;
