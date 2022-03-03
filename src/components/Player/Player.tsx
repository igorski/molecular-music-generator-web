/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Igor Zinken
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
*/
import { Component } from "react";
import Composition from "../../model/Composition";
import { setupCompositionPlayback, play, pause, goToMeasure } from "../../services/AudioService";
import "./Player.scss";

type PlayerProps = {
    composition: Composition
};

interface PlayerState {
    measure   : number,
    beat      : number,
    sixteenth : number,
    total     : number,
    time      : number,
    disabled  : boolean,
    playing   : boolean,
};

export default class Player extends Component<PlayerProps, PlayerState> {
    _keyHandler: ( e:any ) => void;

    constructor( props: PlayerProps ) {
        super( props );

        this.state = {
            measure   : 0,
            beat      : 0,
            sixteenth : 0,
            total     : 1,
            time      : 0,
            disabled  : !props.composition,
            playing   : false,
        };
    }

    componentDidMount(): void {
        this._keyHandler = ( e: React.KeyboardEvent ) => {
            if ( e.keyCode === 32 && this.props.composition ) {
                e.preventDefault();
                this.togglePlayBack( true );
            }
        };
        document.body.addEventListener( "keydown", this._keyHandler );
    }

    componentWillUnmount(): void {
        document.body.removeEventListener( "keydown", this._keyHandler );
    }

    componentDidUpdate( prevProps: PlayerProps ): void {
        if ( this.props.composition === prevProps.composition ) {
            return;
        }
        this.setState({ disabled: false, measure: 0, beat: 0, sixteenth: 0 });
        setupCompositionPlayback( this.props.composition, ( measure: number, beat: number, sixteenth: number, total: number, time: number ) => {
            this.setState({ measure, beat, sixteenth, total, time });
        });
        if ( this.state.playing ) {
            play();
        }
    }

    togglePlayBack( resetPosition: boolean = false ): void {
        if ( !this.state.playing ) {
            play();
        } else {
            pause();
        }
        if ( resetPosition ) {
            this.setState({ ...this.state, ...goToMeasure( 0 ) });
        }
        this.setState({ playing: !this.state.playing });
    }

    goToPreviousMeasure(): void {
        this.setState({ ...this.state, ...goToMeasure( this.state.measure - 1 ) });
    }

    goToNextMeasure(): void {
        this.setState({ ...this.state, ...goToMeasure( this.state.measure + 1 ) });
    }

    render() {
        return (
            <div className="player">
                <button
                    type="button"
                    className="player__play-button"
                    disabled={ this.state.disabled }
                    onClick={ () => this.togglePlayBack() }
                ><img alt="toggle playback" src={ `./icons/icon-${this.state.playing ? "pause" : "play"}.svg` } /></button>
                <button
                    type="button"
                    className="player__transport-button"
                    disabled={ this.state.disabled || this.state.measure === 0 }
                    onClick={ () => this.goToPreviousMeasure() }
                ><img alt="rewind one measure" src="./icons/icon-rewind.svg" /></button>
                <div
                    className={ `player__position ${this.state.disabled ? "player__position--disabled" : "" }` }
                >{ this.state.measure + 1 }:{ this.state.beat + 1 }:1</div>
                <button
                    type="button"
                    className="player__transport-button"
                    disabled={ this.state.disabled || this.state.measure === this.state.total - 1 }
                    onClick={ () => this.goToNextMeasure() }
                ><img alt="fast forward one measure" src="./icons/icon-forward.svg" /></button>
            </div>
        );
    }
};
