import './About.scss';

export default function About(){
    return (
        <div className="aboutContainer">
            <div className='row'>
                <h3>About this project</h3>
            </div>
            <div className='row'>
                <div className="col-md-9">
                    <section>
                        <p>I wanted to make a space for artists and non-artists to collaborate on making fan art for their favorite streamers</p>
                    </section>
                   <section>
                    Anyone can download a model and try to make their own pieces for it, try to match others' style or mix-and-match
                   </section>
                    <section>
                    This is an open source project blah blah blah
                    </section>
                     <section>
                        This couldn't have been possible without help from:
                        (Names to come)
                    </section>
                </div>
            </div>
        </div>
    );
}