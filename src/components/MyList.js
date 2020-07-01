import React, { useState, useEffect, useContext } from 'react';
// import UserContext from '../store/contexts/User.context';
import { useDispatch, useSelector } from 'react-redux';
import { makeRequest } from '../store/actions/makeRequest.action';
import { getCurrentlySaved } from '../store/actions/getCurrentlySaved.action';
import Nav from './Nav';
import MovieList from './MovieList';
import BinManager from './BinManager';
import BinManagerContext from '../store/contexts/BinManager.context.js';
import { Link } from 'react-router-dom';
import { server } from '../APIs';
import { updateUser } from '../store/actions/updateUser.action';

export default function MyList() {

    const dispatch = useDispatch();
    const { loading, result, error } = useSelector(store => store.makeRequest);
    const [binManagerOpen, setBinManagerOpen] = useContext(BinManagerContext);
    const [showBins, setShowBins] = useState(false);
    const user = useSelector(store => store.user.result);
    const currentlySaved = useSelector(store => store.currentlySaved.result);
    const [displaying, setDisplaying] = useState('Currently Saved');
    const [creatingBin, setCreatingBin] = useState(false);
    const [creatingBinError, setCreatingBinError] = useState(null);
    const [updatingBinError, setUpdatingBinError] = useState(null);

    useEffect(_=> {
        if (user) {
            dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) );
            dispatch( getCurrentlySaved(user.currently_saved) );
        }
    }, []);

    useEffect(_=> { if (!showBins) setCreatingBin(false) }, [showBins])

    async function createBin(e) {
        e.persist();
            e.preventDefault();
            const binName = e.target.children[0].value;
        try {
            if (Object.keys(user.bins).includes(binName)) return setCreatingBinError('Bin already exists');
            setCreatingBinError(null);
            const formData = new FormData();
            formData.append('bin', JSON.stringify({ [binName]: [] }) );
                const response = await fetch(server + `users/${user.username}/bins`, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    dispatch( updateUser(user.username) );
                } else setCreatingBinError('Error creating bin');
        } catch (e) { console.log(e) }
        finally {
            if (!Object.keys(user.bins).includes(binName)) {
                setCreatingBin(false);
                e.target.reset();
            }
        }
    }

    async function updateBin(e) {
        e.persist();
        e.preventDefault();
        setUpdatingBinError(null);
        let res;
        const id = e.dataTransfer.getData('text/plain').split('/movies/')[1];
        try {
            if (!user.currently_saved.includes(Number(id))) {
                res = await fetch(server + `movies?user=${user.username}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ movieID: Number(id), inRecent: true })
                });
                !res.ok && setUpdatingBinError('Error updating bin');
            }

            res = await fetch(server + `users/${user.username}/bins`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bin: { [e.target.textContent]: [ ...user.bins[e.target.textContent], id ] }
                })
            });
            res.ok
                ? dispatch( updateUser(user.username) )
                : setUpdatingBinError('Error updating bin');
        } catch (e) { console.log(e) }
    }

    const onClickYourBins = e => {
        e.preventDefault();
        let { style } = e.target.parentElement.children[1]
        if (showBins) {
            style.maxHeight = 0;
            style.transform = 'scaleY(0)';
        } else {
            style.maxHeight = '100%';
            style.transform = 'scaleY(1)';
        }
        setShowBins(!showBins);
    }

return loading ? <div>Loading...</div> : error ? <div>Error loading movies</div> : (
        <>
            <div style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ display: 'flex', height: '100vh', flexDirection: 'column '}}>
                    <Nav />
                    {user && <ul className="sidebar">
                        {<li className="sidebar-li-hover" onClick={e => {
                                dispatch( makeRequest('movies/list', '?movies=' + user.currently_saved) );
                                setDisplaying('Currently Saved');
                            }} tabIndex="0">Currently Saved</li>
                        }
                        { user.show_save_history && <li className="sidebar-li-hover" onClick={e => {
                                dispatch( makeRequest('movies/list', '?movies=' + user.recent_save_history) );
                                setDisplaying('Save History');
                            }} tabIndex="0">Save History</li>
                        }
                        <li>
                            {Object.entries(user.bins).length
                                    ? 
                                    <div>
                                        <label onFocus={e => e.target.style.color = showBins ? 'white' : 'var(--color-offset)'} onBlur={e => e.target.style.color = showBins ? 'var(--color-offset)' : 'red'} tabIndex="0" style={{ outline: 'none', cursor: 'pointer' }} onClick={onClickYourBins} onKeyDown={e => e.keyCode === 13 && onClickYourBins(e)} onMouseOver={e => e.target.style.color = showBins ? 'white' : 'var(--color-offset)'} onMouseOut={e => e.target.style.color = showBins ? 'var(--color-offset)' : 'red'}>Your Bins</label>
                                        {creatingBinError && <div style={{ color: 'maroon' }}>{creatingBinError}</div>}
                                        <ul style={{ maxHeight: 0, transform: 'scaleY(0)', transformOrigin: 'top', transition: 'max-height 150ms ease-out, transform 150ms ease-out' }}>
                                            {Object.keys(user.bins).map((bin, i) =>
                                                <li onFocus={e => e.target.style.color = 'var(--color-offset)'} onBlur={e => e.target.style.color = 'red'} tabIndex={showBins ? 0 : '-1'} onMouseOver={e => {
                                                    e.target.style.color = 'var(--color-offset)';
                                                    e.target.style.cursor = 'pointer'
                                                }} onMouseOut={e => e.target.style.color = 'red'} style={{ marginLeft: '1.25rem', outline: 'none' }} key={i} onClick={e => {
                                                    e.preventDefault();
                                                    dispatch( makeRequest('movies/list', '?movies=' + user.bins[bin]) );
                                                    setDisplaying(bin);
                                                }} onKeyDown={e => {
                                                    e.preventDefault();
                                                    if (e.keyCode === 13) {
                                                        dispatch( makeRequest('movies/list', '?movies=' + user.bins[bin]) );
                                                        setDisplaying(bin);
                                                    }
                                                }} onDrop={e => {
                                                    e.preventDefault();
                                                    console.log(user.currently_saved.length);
                                                    !user.currently_saved.includes( Number(e.dataTransfer.getData('text/plain').split('/movies/')[1]) )
                                                        ? window.confirm('Save movie and add to bin?') && updateBin(e)
                                                        : updateBin(e);
                                                }} onDragOver={e => { e.preventDefault(); e.target.style.color = 'blue' }} onDragLeave={e => { e.preventDefault(); e.target.style.color = 'black' }}>
                                                    {bin}
                                                </li>
                                            )}
                                            <li style={{ marginLeft: '1.25rem' }}>
                                                {creatingBin
                                                    ? <form onSubmit={createBin}>
                                                        <input style={{ height: '1.3rem', width: '125px' }} type="text" placeholder="Enter bin name" />
                                                    </form>
                                                    : <button tabIndex="0" onClick={_=> setCreatingBin(true)} onFocus={e => e.target.style.transform = 'scale(1.15)'} onBlur={e => e.target.style.transform = 'scale(1)'} onKeyDown={e => e.keyCode === 13 && setCreatingBin(true)} style={{ backgroundColor: 'transparent', border: 'none', color: 'red', fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                    transition: 'transform 50ms ease-out'
                                                 }} onMouseOver={e => {
                                                    e.target.style.transform = 'scale(1.15)'; e.target.style.cursor = 'pointer'
                                                }} onMouseOut={e => e.target.style.transform = 'scale(1)'}>+</button>
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    : 'Use the bin manager to organize your movies'
                            }
                        </li>
                        <li>
                            <button 
                            onMouseOver={e =>  e.target.style.backgroundColor = 'var(--bg-color-light)'
                            } onMouseOut={e => {
                                if (document.activeElement !== e.target)
                                    e.target.style.backgroundColor = 'var(--color-offset)'
                            }} onFocus={e => e.target.style.backgroundColor = 'var(--bg-color-light)'} onBlur={e => {
                                if (![...document.querySelectorAll(':hover')].includes(e.target))
                                    e.target.style.backgroundColor = 'var(--color-offset)'
                            }} style={{ marginTop: '1rem', marginLeft: '.25rem' }}className="button" onClick={e => {
                                e.target.blur();
                                setBinManagerOpen(!binManagerOpen);
                            }}>Manage Bins</button>
                        </li>
                    </ul>}
                </div>
                
                {user
                    ? <MovieList withFilter displaying={displaying} movies={result} headingMargin="2rem" heading={(_=> {
                        switch (displaying) {
                            default: return result.length
                                ? `This is what was in "${displaying}"`
                                : 'This bin was empty!';
                            case 'Currently Saved':
                                return result.length
                                    ? 'Here\'s your complete list of movies'
                                    : 'Save movies by going to their page';
                            case 'Save History':
                                return result.length
                                    ? 'These are all the movies you\'ve ever saved'
                                    : 'Save movies by going to their page';
                        }
                    })()}/>
                    : <h2 style={{ flex: 4, margin: '2rem' }}><Link to="/register">Log in</Link> to see your saved movies</h2>
                }
            </div>

            {user && binManagerOpen && <BinManager movies={currentlySaved} displaying={displaying} setDisplaying={setDisplaying}></BinManager>}
        </>
    )
}