/* Reusable Action Configuration */
export function ActionPrototype(
	LAUNCH_TYPE,
	SUCCESS_TYPE,
	FAILURE_TYPE,
	url,
	options = {}
) {
	return (...params) => {
		params.forEach((param, i) => {
			url = url.replace(`!{${i + 1}}!`, param);
		});
		return dispatch => {
			dispatch({ type: LAUNCH_TYPE });
			fetch(url, { ...options, credentials: 'include' })
				.then(res => res.json())
				.then(payload => {
					dispatch({ type: SUCCESS_TYPE, payload });
				})
				.catch(payload => dispatch({ type: FAILURE_TYPE, payload }));
		};
	};
}
