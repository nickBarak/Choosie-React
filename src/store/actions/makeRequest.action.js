import { MAKE_REQUEST_LAUNCH, MAKE_REQUEST_SUCCESS, MAKE_REQUEST_FAILURE } from "../reducers/makeRequest.reducer";
import { server } from '../../APIs';

export const createMakeRequestLaunch = _=> ({ type: MAKE_REQUEST_LAUNCH }),
    createMakeRequestSuccess = payload => ({ type: MAKE_REQUEST_SUCCESS, payload }),
    createMakeRequestFailure = payload => ({ type: MAKE_REQUEST_FAILURE, payload });

export const makeRequest = (route, querystring, options={}) => {
    return dispatch => {
        dispatch(createMakeRequestLaunch())
        fetch(server+`${route}${querystring ? querystring : ''}`, { ...options, mode: 'cors' })
            .then(res => res.json())
            .then(res => {
                dispatch( createMakeRequestSuccess(res) );
            })
            .catch(e => dispatch( createMakeRequestFailure(e) ))
    }
}