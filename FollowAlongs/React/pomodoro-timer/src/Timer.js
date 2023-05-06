import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import { useContext, useState, useEffect, useRef } from 'react';
import SettingsContext from './SettingsContext';


const timerColor1 = '#F6546A';
const timerColor2 = '#B4EEB4';


function Timer() {


    const settingsInfo = useContext(SettingsContext);


    const [isPaused, setIsPaused] = useState(true);


    const [secondsLeft, setSecondsLeft] = useState(0);


    const [mode, setMode] = useState('work'); // work or break or null


    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);



    function initTimer() {


        setSecondsLeft(settingsInfo.workMinutes * 60);


    }


    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);


    }


    useEffect(() => {


        function switchMode() {
            const nextMode = modeRef.current === 'work' ? 'break' : 'work';
            const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60;

            setMode(nextMode);
            modeRef.current = nextMode;

            setSecondsLeft(nextSeconds);
            secondsLeftRef.current = nextSeconds;
        }


        secondsLeftRef.current = settingsInfo.workMinutes * 60;
        setSecondsLeft(secondsLeftRef.current);



        const interval = setInterval(() => {


            if (isPausedRef.current) {
                return;
            }


            if (secondsLeftRef.current === 0) {


                return switchMode();


            }


            tick();
        }, 1000);


        return () => clearInterval(interval);
    }, [settingsInfo]); // <-- this is the dependency array and makes it so useEffect only runs when SettingsInfo changes




    const totalSeconds = mode === 'work'
        ? settingsInfo.workMinutes * 60
        : settingsInfo.breakMinutes * 60;


    const percentage = Math.round(secondsLeft / totalSeconds * 100);

    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return (


        <div>
            <CircularProgressbar value={percentage} text={minutes + ":" + seconds} styles={buildStyles({
                textColor: '#fff',
                pathColor: mode === 'work' ? timerColor1 : timerColor2,
                trailColor: 'rgba(255,255,255,0.2)',
            })} />


            <div style={{ marginTop: '20px' }}>
                {isPaused ?
                    <PlayButton onClick={() => { setIsPaused(false); isPausedRef.current = false }} /> :
                    <PauseButton onClick={() => { setIsPaused(true); isPausedRef.current = true }} />
                }
            </div>


            <div style={{ marginTop: '20px' }}>
                <SettingsButton onClick={() => settingsInfo.setShowSettingsPage(true)} />
            </div>
        </div>
    )
}


export default Timer;