import React, { Component } from "react";
import './Loading.css'
import {AiOutlineReload} from 'react-icons/ai'

class Loading extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message:props.term,
            loading:props.loading,
        };
    }

    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {message, loading} = this.state
        if(!loading)
            return null

        return (
            <div className={'loading'}>
                {message && <div className={'loading-message'}>{message}</div>}
                <div className={'loading-icon'}><AiOutlineReload className={'icon-spin'}/></div>
            </div>
        );
    }
}

export default Loading;
