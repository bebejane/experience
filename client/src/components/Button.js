import React, { Component } from "react";
import './Button.css'

class Button extends Component {

    constructor(props) {
        super(props);
        this.state = {
            icon:props.icon,
            toggle:props.togle,
            disabled:props.disabled
        };
    }
    onClick(e){
        this.props.onClick(e)
    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {icon, toggle, disabled, size} = this.state

        return (
            <div className={'button'} style={size ? {"fontSize": size} : undefined} disabled={disabled} onClick={(e)=>this.onClick(e)}>
                {icon}
            </div>
        );
    }
}

export default Button;
