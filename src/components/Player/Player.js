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
import { setSequencerCallback, goToMeasure } from "../../services/AudioService";
import "./Player.scss";

export default class Player extends Component {
    constructor( props ) {
        super( props );

        this.state = {
            measure : 0,
            total   : 1,
            time    : 0
        };
    }

    goToPreviousMeasure() {
        goToMeasure( this.state.measure - 1 );
    }

    goToNextMeasure() {
        goToMeasure( this.state.measure + 1 );
    }

    componentDidMount() {
        setSequencerCallback(( measure, total, time ) => {
            this.setState({ measure, total, time });
        });
    }

    componentWillUnmount() {
        setSequencerCallback( null );
    }

    render() {
        return (
            <div className="player">
                <button
                    type="button"
                    className="button"
                    disabled={ this.state.measure === 0 }
                    onClick={ () => this.goToPreviousMeasure() }
                >&#171;</button>
                <p>{ this.state.measure + 1 } / { this.state.total }</p>
                <button
                    type="button"
                    className="button"
                    disabled={ this.state.measure === this.total - 1 }
                    onClick={ () => this.goToNextMeasure() }
                >&#187;</button>
            </div>
        );
    }
};