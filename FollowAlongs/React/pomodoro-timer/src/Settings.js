import ReactSlider from "react-slider";
import './Slider.css';
import SettingsContext from "./SettingsContext";
import { useContext } from "react";
import BackButton from "./BackButton";

function SettingsPage() {
    const settingsInfo = useContext(SettingsContext);
    return (
        <div style={{ textAlign: 'left' }}>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <BackButton onClick={() => settingsInfo.setShowSettingsPage(false)} />
            </div>
            <label>work {settingsInfo.workMinutes}:00</label>
            <ReactSlider
                className="slider"
                thumbClassName="thumb"
                trackClassName="track"
                value={settingsInfo.workMinutes}
                onChange={newValue => { settingsInfo.setWorkMinutes(newValue) }}
                min={1}
                max={120}
            />
            <label>break {settingsInfo.breakMinutes}:00</label>
            <ReactSlider
                className="slider break"
                thumbClassName="thumb"
                trackClassName="track"
                value={settingsInfo.breakMinutes}
                onChange={newValue => { settingsInfo.setBreakMinutes(newValue) }}
                min={1}
                max={120}
            />
        </div>

    )
}

export default SettingsPage;