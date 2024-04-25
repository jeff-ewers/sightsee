import "./Hero.css"
import balloons from '../../assets/balloons-taryn_elliot.mp4'

export const Hero = () => {
    return (
        <div className="hero">
            <video className='videoTag' autoPlay loop muted>
                <source src={balloons} type='video/mp4' />
            </video>
            <div className="text-overlay">
                <div className="text-overlay__title">sightsee</div>
                <div className="text-overlay__tagline">wander with purpose</div>
            </div>
        </div>
    );
}
