import React, { Component } from "react";
import Button from './Button'
import SourceCard from './SourceCard'
import FeedCard from './FeedCard'
import Search from './Search'
import Error from './Error'
import Loading from './Loading'
import axios from "axios"
import history from '../history'

import { IoIosRefresh } from 'react-icons/io'
import { BsCheckAll } from 'react-icons/bs'

import "./App.css";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: '',
            feedId: null,
            loading: false,
            loadingFeeds: true,
            refreshing: false,
            articles: [],
            feeds: [],
            search: [],
            page: 1,
            pages: 1,
            init: false,
            view:'full',
            error:null
        };
    }

    api(path, data = {}, opt = { method: 'get' }) {
        console.log(opt.method.toUpperCase(), path, data)
        return axios({
            method: opt.method || 'get',
            url: "http://localhost:3001/api" + path,
            data: data
        }).then((res) => {
            if(!res) return
            console.log(res.data)
            return res
        }).catch((error)=>{

            let newErr = error;

            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log('response error')
              newErr = {...error.response.data, status:error.response.status, type:1}
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log('request error')
              newErr = {message:'Request error: ' + error.message, status:error.request.status, type:2}
            } else {
              // Something happened in setting up the request that triggered an Error
              newErr.type = 3
              console.log('network error')
            }
            console.log(newErr, error)
            this.setState({error:newErr})
            throw new Error(newErr)
          });
    }
    addFeed(url) {
        if (!url) return
        const data = { url: url }
        console.log('add feed', url)
        this.setState({ loadingFeeds: 'Adding feed...', search: [] })
        return this.api('/feed', data, { method: 'post' })
            .then((res) => {
                console.log(res)
                return this.feeds().then(() => {
                    return this.feed(res.data._id)
                })
            })
            .catch((err) => this.setState({loadingFeeds:false}))
    }
    updateFeed(id, name) {

        return this.api('/feed', { _id: id, name: name }, { method: 'patch' })
            .then((res) => {
                const articles = this.state.articles.map((a) => res.data._id === a._id ? res.data : a)
                this.setState({ articles: articles })
                return res
            })
            .then(() => this.feeds(true))
            .catch((err) => {})
    }
    deleteFeed(id) {

        return this.api('/feed', { _id: id }, { method: 'delete' })
            .then((res) => {
                if (id === this.state.feedId)
                    this.setState({ articles: [], feedId: null })
                return res
            })
            .then(() => this.feeds(true))
            .catch((err) => {})

    }
    refreshFeed(id) {

        this.setState({ refreshing: id })

        return this.api('/feed/' + id + '/refresh', {}, { method: 'get' })
            .then((res) => {
                if (id === this.state.feedId)
                    this.setState({ articles: res.data })
                return res
            })
            .then(() => this.feeds(true))
            .catch((err) => {})
            .then(() => this.setState({ refreshing: false }))
    }
    loadFeed(id) {
        this.setState({ refreshing: true })
        this.feed(id).then((articles) => {

        })
        .catch((err) => {})
        .then(() => this.setState({ refreshing: false }))
    }
    openLink(id, link) {
        console.log('open link', link, id)

        const feedId = this.state.feedId
        const page = this.state.page
        this.toggleRead(feedId, id, true).then((article) => {
            history.replace('/feed/' + feedId + '/page/'+page, this.state)
            setTimeout(() => window.location = link, 1000)
        }).catch((err) => this.setState({error:err}))
    }
    onToggleRead(feedId, id, read) {
        this.toggleRead(feedId, id, read)
            .then(() => this.feeds(true))
            .catch((err) => {})
    }
    toggleRead(feedId, id, read) {

        return this.api('/feed/' + feedId, { _id: id, read: read }, { method: 'patch' })
            .then((res) => {
                const articles = this.state.articles.map((a) => res.data._id === a._id ? res.data : a)
                this.setState({ articles: articles })
                return res
            })
            .catch((err) => {
                throw err
            })
    }
    toggleAllRead(feedId,) {

        const articles = this.state.articles;
        const allRead = articles.filter((a)=>a.read).length
        const newArticles = articles.map((a) => {
            return { read: allRead ? false : true, _id: a._id }
        })

        return this.api('/feed/' + feedId, newArticles, { method: 'patch' })
            .then((res) => this.setState({ articles: res.data }))
            .catch((err) => {
                throw err
            })

    }
    feeds(silent) {

        this.setState({ loadingFeeds: !silent ? true:false })
        return this.api('/feed', {}, { method: 'get' })
            .then(res => this.setState({ feeds: res.data }))
            .catch((err) => {
                throw err
            })
            .then(() => this.setState({ loadingFeeds: false }))
    }
    feed(id, opt = { page: 1 }) {

        this.setState({ refreshing: id })
        return this.api('/feed/' + id + '/page/' + opt.page, {}, { method: 'get' })
            .then(res => {
                const articles = res.data.data;
                const page = res.data.page
                const pages = res.data.pages

                const newState = { ...this.state, feedId: id, articles: articles, refreshing: false, page: page, pages:pages}
                history.push('/feed/' + id + '/page/' + opt.page, newState)
                this.setState(newState)
                return res.data
            })
            .catch((err) => {
                console.error(err)
                throw err
            })
            .then((res) => {
                this.setState({ refreshing: false });
                console.log('then')
                return res;
            })
    }
    browse(pos) {
        let page = this.state.page + pos
        let pages = this.state.pages;
        if(page>pages || page <=0) return

        this.feed(this.state.feedId, { page: page }).then((data) => {

            const articles = data.data;
            if (!articles.length) {
                this.setState({ page: data.page - 1 })
            } else
                this.setState({ articles: articles, page: data.page })
        }).catch((err) => {})
    }
    error(err) {

    }
    componentDidMount() {

        history.listen((location, action) => {
            this.setState(location.state)
        });
        const state = history.location.state;
        if (state)
            this.setState({ url: state.url, feedId: state.feedId, articles: state.articles, feeds: state.feeds })
        this.init()
    };
    init(attempts) {

        this.setState({ init: false })
        this.feeds().then(() => {
            this.setState({ init: true })
        }).catch((err) => {
            this.setState({ init: false })
            setTimeout(() => this.init(), 2000, attempts ? attempts++ : 1)
        })

        this.test('/feed/today')
    }
    test(path) {
        return
        return this.api(path, {}, { method: 'get' })
            .then((res)=>{
                console.log(res)
            })
            .catch((err) => {
                //this.setState({error:err})
                console.log(err)
            })
    }
    onErrorClose(err){
        this.setState({error:null})
    }
    onToggleView(type){
        this.setState({view:type == 'full' ? 'mini' : 'full'})
    }
    render() {

        const { articles, feeds, feedId, search, refreshing, loadingFeeds, init, error, pages, page, view } = this.state
        const feed = feeds.filter((f) => f._id === feedId)[0] || {}
        const loadingFeed = feedId !== undefined && feedId === refreshing

        if (!init)
            return <Loading message={'Starting up...'} loading={true}/>
        return (
            <div className="App">
                <div id="left">
                    <Search onClick={(url)=>this.addFeed(url)}/>
                    {!loadingFeeds && !search.length && feeds.map((f, idx)=>
                        <SourceCard
                            key={f._id}
                            name={f.name}
                            url={f.url}
                            id={f._id}
                            unread={f.unread}
                            count={f.count}
                            refreshing={refreshing === f._id}
                            onClick={()=>this.loadFeed(f._id)}
                            onRemove={()=>this.deleteFeed(f._id)}
                            onRefresh={()=>this.refreshFeed(f._id)}
                            onUpdate={(id, name)=>this.updateFeed(id, name)}
                            selected={f._id === feedId}
                        />
                    )}
                    <Loading message={loadingFeeds} loading={loadingFeeds}/>
                    {!feeds.length && <div className={'refresh'}><Button onClick={()=>this.feeds()} icon={'R'}/></div>} 
                </div>
                <div id="right">
                    <div id={'feed-header'}>
                        <div id={'feed-title'}>{feed.name}</div>

                        <div id={'feed-tools'}>
                            <Button onClick={()=>this.browse(-1)} icon={'-'}/>
                            <Button onClick={()=>{}} icon={page + '/' + pages} size={11}/>
                            <Button onClick={()=>this.browse(1)} icon={'+'}/>
                            <div class={'button-spacer'}></div>
                            <Button onClick={()=>this.onToggleView(view)} icon={'V'}/>
                            <Button onClick={()=>this.toggleAllRead(feed._id)} icon={<BsCheckAll/>}/>
                            <Button onClick={()=>this.refreshFeed(feed._id)} icon={<IoIosRefresh/>}/>
                        </div>

                    </div>
                    <div id="feed">
                         <FeedCard
                            name={feed.name}
                            id={feed._id}
                            articles={articles}
                            refreshing={loadingFeed}
                            view={view}
                            onClick={(id, link)=>this.openLink(id, link)}
                            onToggleRead={(id, read)=>this.onToggleRead(feedId, id, read)}
                        />
                    </div>

                </div>
                {error && <Error error={error} onClose={()=>this.onErrorClose(error)}/>}
            </div>
        );
    }
}

export default App;
