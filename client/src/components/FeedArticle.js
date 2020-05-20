import React, { Component } from "react";
import FeedArticleTools from './FeedArticleTools'
import "./FeedArticle.css";

class FeedArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            feed: props.feed,
            article: props.article,
            view:props.view,
            refreshing: props.refreshing,
            fullView: props.view === 'full'
        };
    }
    onClick(url) {
        console.log(this.state.article)
        this.setState({ selected: this.state.article._id, url: url })
        this.props.onClick(this.state.article._id, this.state.article.link)
    }
    onToggleRead() {
        const read = !this.state.article.read
        this.props.onToggleRead(this.state.article._id, read)
        this.setState({ article: { ...this.state.article, read: read } })
    }
    onToggleView() {
        console.log('toggle')
        this.setState({ fullView: !this.state.fullView})
    }
    deleteFeed(id) {
        this.props.onRemove()
    }
    refresh() {

    }
    componentDidMount() {

    }
    contentSnippet(article) {

        return article.content
        let snippet = article.contentSnippet || article.content || '';

        if(!snippet)
            return ''

        let sentances = snippet.split('.')

        if (sentances.length > 1)
            snippet = sentances.slice(0, 2).join('.')
        else
            snippet = snippet.substring(0, 100) + '...'

        return snippet
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.view !== prevState.view)
            return {...nextProps, fullView:nextProps.view === 'full'} 
        else
            return nextProps
    }

    render() {
        const { article, selected, view ,feed, fullView} = this.state

        return (
            <div className={'feed-card' + (selected === article._id ? ' feed-card-selected' : '')}>
                <div className={'feed-card-left' + (article.read ? ' feed-card-read' : '')}  onClick={()=>this.onClick(article._id, article.link)}>
                    <div className={'feed-card-title'}>
                        <div className={'feed-card-date'}>{article.time} - {feed}</div>
                        {article.title}
                            <div
                                className={'feed-card-content'}
                                dangerouslySetInnerHTML={{ __html: fullView ? article.content : article.contentSnippet}}>
                            </div>
                    </div>
                </div>
                <div className={'feed-card-right'}>
                    <FeedArticleTools
                        article={article}
                        view={fullView ? 'full' : 'mini'}
                        onToggleRead={(read)=>this.onToggleRead()}
                        onToggleView={()=>this.onToggleView()}
                        onOpen={()=>this.onClick(article.link)}
                    />
                </div>
            </div>
        );
    }
}

export default FeedArticle;
