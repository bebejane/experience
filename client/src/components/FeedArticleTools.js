import React, { Component } from "react";
import {AiOutlineArrowRight, AiOutlineCheck} from 'react-icons/ai'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'

import Button from './Button'
import "./FeedArticleTools.css";

class FeedArticleTools extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:props.id,
            view:props.view,
            article:props.article
        };
    }
    onClick(id, url){
        this.setState({selected:this.state.id})
        this.props.onClick(url)
        //window.location = url
    }
    onToggleRead(){
        const read = !this.state.article.read
        this.props.onToggleRead(this.state.article._id, read)
        this.setState({article:{...this.state.article, read:read}})
    }
    deleteFeed(id) {
        this.props.onRemove()
    }
    refresh(){

    }
    onRead(){

    }
    onOpen(){
        this.props.onOpen()
    }
    onToggleView(){
        this.props.onToggleView(this.state.id)
    }
    componentDidMount() {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const fullView = this.state.view === 'full'

        return (
            <div className={'feed-card-tools'}>
                <Button onClick={(e)=>this.onToggleView(e)} icon={fullView ? <FiChevronUp/> : <FiChevronDown/>}/>
                {fullView &&
                    <div>
                        <Button onClick={(e)=>this.onToggleRead(e)} icon={<AiOutlineCheck/>}/>
                        <Button onClick={(e)=>this.onOpen(e)} icon={<AiOutlineArrowRight/>}/>
                    </div>
                }
            </div>
        );
    }
}

export default FeedArticleTools;
