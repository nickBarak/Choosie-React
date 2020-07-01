import React, { useState, useEffect, useContext } from 'react';
import HistoryContext from '../store/contexts/History.context';

const sections = [
    [{label: 'Overview', content: `Choosie is an intelligent service for simplifying movie selection. It employs machine learning technology - primarily in the form of deep learning - to understand those who use it. That means that it is able to translate your input through a series of data modifications to a language that a computer can make sense of effectively. In doing this, Choosie learns how to serve you individually - from your personal tastes to your typical selection process - so you will truly receive tailored assistance.`}, {label: 'Start', content: `Selecting the 'Start' button on the home screen will initiate a questionnaire`}, {label: 'My List', content: `You can navigate to a personal store of saved movies by selecting 'My List' from the home screen or navigation bar. Here you'll be able to keep track of any movies on your "to-watch" list and any others you don't want to forget about. You can create multiple 'bins' to store related movies and label them to your preference in order to manage your collection more easily.`}, {label: 'Popular', content: `In 'Popular' you can view movies that are currently trending, released recently, or have been saved by many other users.`}],
    [{label: 'About Me', content: `My name is Nick Barak and I'm a self-taught developer. I recently graduated from the University of California, Santa Barbara with a degree in Economics & Accounting and am currently pursuing a career in software engineering. Choosie is my first major project and I am happy to have been able to utilize a lot of the things that I have learned since I started learning to code in the creation of this application. This project is the first of many to come.`}, {label: 'Contact', content: `You can contact me by email at nicholasjbarak@gmail.com. I am always looking for feedback for improvement so don't hesitate to send me suggestions or complaints.`}]
], slogan = `Choosie is the solution for those without problems.`;

function Help() {
    const history = useContext(HistoryContext);

    const [state, setState] = useState({
        more: false,
        sections: sections[0]
    });

    useEffect(_=> setState({...state, sections: sections[state.more ? 1 : 0]}), [state.more]);

    return (
        <div className="container">
            <div className="help">
                <h2>What is <span style={{ fontWeight: 600 }} className="logo">Choosie</span>?</h2>
                <article style={{ width: '100%' }}>
                    <br />
                    <div style={{ fontWeight: 'bold' }}>{slogan}</div>
                    <br />
                    {state.sections.map((section, i) =>
                        <section key={i}>
                            <label>{section.label}</label>
                            <div>{section.content}</div>
                        </section>
                    )}
                </article>
                <div style={{ position: 'relative', display: 'flex', width: '100%' }}>
                    <button className="button-v2"  onClick={_=> history.push('/')}>Back to Home</button>
                    <button style={{ right: 0, left: 'auto'}} className="button-v2" onClick={_=> { setState({...state, more: !state.more}); history.push('/help') }}>{state.more ? 'Previous' : 'More'}</button>
                </div>
            </div>
        </div>
    )
}

export default Help