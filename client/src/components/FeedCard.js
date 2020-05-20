import React, { Component } from "react";
import Loading from './Loading'
import FeedArticle from './FeedArticle'
import moment from 'moment'
import "./FeedCard.css";

class FeedCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:props.id,
            name:props.name,
            view:props.view,
            url:props.url,
            selected:props.selected,
            articles:props.articles || [],
            refreshing:props.refreshing,
        };
    }
    onClick(id, url){
        this.setState({selected:id, url:url})
        this.props.onClick(id, url)
    }
    onToggleRead(id, read){
        this.props.onToggleRead(id, read)
    }
    deleteFeed(id) {
        this.props.onRemove()
    }
    refresh(){

    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {refreshing, articles, view, name} = this.state

        articles.forEach((a)=>{
            a.time = moment(a.pubDate).fromNow()
        })

        if(articles.length === 0)
            return <div className={'empty'}><div>Nothing heree</div></div>

        return (
            <div className={'feed'}>
                {refreshing && <Loading message={'Loading feed...'} loading={true}/>}
                {!refreshing && articles.map((a, idx)=>
                    <FeedArticle
                        key={idx} 
                        article={a}
                        view={view}
                        feed={a.feed ? a.feed.name : name}
                        onClick={(id, link)=>this.onClick(a._id, link)} 
                        onToggleRead={(id, read)=>this.onToggleRead(id, read)}
                    />
                )}
            </div>
        );
    }
}

export default FeedCard;
