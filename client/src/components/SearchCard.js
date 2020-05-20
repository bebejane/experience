import React, { Component } from "react";
import url from "url"
import "./SearchCard.css";

class SearchCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            site:props.site,
            title:props.title,
            link:props.link,
        };
    }
    onClick(link){
        this.props.onClick(link)
    }
    addFeed(){

    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {title, link} = this.state
        const host = url.parse(this.state.link).hostname
        return (
            <div className={'search-card'} onClick={()=>this.onClick(link)}>
                <div className={'search-card-title'}>
                    {title}
                    <div className={'search-card-link'}>{host}</div>
                </div>
            </div>
        );
    }
}

export default SearchCard;
