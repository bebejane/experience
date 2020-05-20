import React, { Component } from "react";
import './Error.css'
//import {AiOutlineReload} from 'react-icons/ai'

class Error extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error:props.error,
            show:true
        };
    }
    onClose(){
        this.props.onClose()
    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {error, show} = this.state
        if(!error) return null

        return (
            <div className={'error-wrap'}>
                <div className={'error-modal'}>
                    <div className={'error-header'}>Error</div>
                    <div className={'error-content'}>
                        <div className={'error-message'}>{error.message} ({error.type})</div>
                        <div className={'error-bottom'}>
                            <button onClick={()=>this.onClose()}>close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Error;
