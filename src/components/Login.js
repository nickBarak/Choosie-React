import React, { useState, useContext, useEffect, useRef } from 'react';
import { server } from '../APIs';
// import UserContext from '../store/contexts/User.context';
import HistoryContext from '../store/contexts/History.context';
import { updateUser } from '../store/actions/updateUser.action';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
    const dispatch = useDispatch();
    const user = useSelector(store => store.user.result);
    const history = useContext(HistoryContext);
    // const [user, setUser] = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(null);
    const loginForm = useRef(null);
    const errorRef = useRef(null);

    useEffect(_=> {
        if (error && loginForm.current) {
            loginForm.current.style.transform = 'translateY(1rem)';
            errorRef.current.style.transform = 'translateY(1.4rem)';
        } else if (loginForm.current) {
            loginForm.current.style.transform = 'translateY(0)';
            errorRef.current.style.transform = 'translateY(0)';
        }
    }, [error])

    const onLogin = async e => {
        e.persist();
        e.preventDefault();
        const username = e.target.children[0].value,
            password = e.target.children[2].value;
        if (!username && !password) {
            setError(null);
            setOpen(false);
            return;
        }
        try {
            const response = await fetch(server+`users/${username}`),
            json = await response.json();
            if (!json[0]) { setError('Invalid login'); return }
            if (String(json[0].password) === password) {
                dispatch( updateUser(username) );
                setError(null);
            } else setError(`Invalid login`);
        } catch (e) { setError('Something went wrong'); console.log(e) }
    }
    
    function goToRegister(e) {
        e.persist();
        e.preventDefault();
        e.stopPropagation();
        history.push('/register')
    }

    function mouseOverLogin(e) {
        e.target.style.color = 'red';
    }

    function mouseOutLogin(e) {
        e.persist();
        setTimeout(_=> e.target.style.color = 'white', 250);
    }

    return user
            ? (
                <>
                    <div style={{ color: 'var(--color-offset)', fontSize: '1.75rem', margin: '1rem 0 0 1rem' }}>Welcome, {user.name || user.username}</div>
                    <span style={{ padding: '0 2rem' }}>
                        <button onClick={_=> { dispatch( updateUser(null) ); setOpen(false) }}style={{ color: 'white', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', marginRight: '.5rem' }} onMouseOver={e => e.target.style.color = 'silver'} onMouseOut={e => e.target.style.color = 'white'} onFocus={e => e.target.style.color = 'silver'} onBlur={e => e.target.style.color = 'white'}>Log out</button>
                        <button onClick={_=> history.push(`profile/${user.username}`)} style={{ color: 'white', cursor: 'pointer', backgroundColor: 'transparent', border: 'none', marginLeft: '.5rem' }} onMouseOver={e => e.target.style.color = 'silver'} onMouseOut={e => e.target.style.color = 'white'} onFocus={e => e.target.style.color = 'silver'} onBlur={e => e.target.style.color = 'white'}>View profile</button>
                    </span>
                </>
            )
            : open 
                ? (
                    <>
                        <div ref={errorRef} style={{ position: 'absolute', top: '-1rem', left: '2.8rem', color: 'red', transition: 'transform 300ms ease-in-out' }}>{error}</div>
                        <form onSubmit={onLogin} ref={loginForm} style={{backgroundColor: 'transparent', margin: '1rem', display: 'inline-block', transition: 'transform 300ms ease-in-out'}}>
                            <input style={{ padding: '.25rem', height: '1.25rem', marginBottom: '.2rem'}} type="text" placeholder="username" />
                            <br />
                            <input style={{ padding: '.25rem', height: '1.25rem' }} type="password" placeholder="password" />
                            <br />
                            <div style={{ marginTop: '.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                <button className="button-manage-movie" onClick={e => e.target.blur()}>Log in</button>
                                <button className="button-manage-movie"onClick={goToRegister}>Sign up</button>
                            </div>
                        </form>
                    </>
                )
                : <button className="button-login" onClick={_=> setOpen(true)}>
                    <span style={{ transition: 'color 250ms ease-in' }} onMouseOver={mouseOverLogin} onMouseOut={mouseOutLogin}>L</span>
                    <span style={{ transition: 'color 250ms ease-in' }} onMouseOver={mouseOverLogin} onMouseOut={mouseOutLogin}>o</span>
                    <span style={{ transition: 'color 250ms ease-in' }} onMouseOver={mouseOverLogin} onMouseOut={mouseOutLogin}>g</span>
                    <span style={{ transition: 'color 250ms ease-in', marginLeft: '.35rem' }} onMouseOver={mouseOverLogin} onMouseOut={mouseOutLogin}>i</span>
                    <span style={{ transition: 'color 250ms ease-in' }} onMouseOver={mouseOverLogin} onMouseOut={mouseOutLogin}>n</span>
                </button>
        
}

export default Login
