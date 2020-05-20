import React, { Component } from "react";
import "./SourceCard.css";

class SourceCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id:props.id,
            unread:props.unread,
            count:props.count,
            name:props.name,
            url:props.url,
            selected:props.selected,
            notools:props.notools,
            refreshing:props.refreshing,
            edit:false
        };
    }
    onClick(id){
        if(this.state.selected)
            this.setState({edit:this.state.name})
        else
            this.setState({selected:true, edit:false}, ()=>this.props.onClick(id))
    }
    onChange(e){
        console.log(e.target.value)
        this.setState({edit:e.target.value})
    }
    onSubmit(e){
        const newName = this.state.edit;
        this.setState({selected:true, edit:false, name:newName}, ()=>{
            this.props.onUpdate(this.state.id, newName)
        })
        e.preventDefault()
    }
    deleteFeed(id) {
        this.props.onRemove()
    }
    refreshFeed(id){
        this.props.onRefresh(id)
        this.setState({refreshing:true})
    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {name, id, selected, notools, unread, edit} = this.state
        const loading = this.state.loading

        if(loading)
            return <div className={'loading'}><div>{loading}</div></div>
        return (
            <div key={id} className={'source-card' + (selected ? ' source-card-selected' : '')}>
                <div className={'source-card-unread'}>{unread}</div>
                <form onSubmit={(e)=>this.onSubmit(e)}>
                    <input type="text" className={'source-card-title'} value={edit || name} onChange={(e)=>this.onChange(e)} readOnly={!edit} onClick={()=>this.onClick(id)}/>
                </form>
                {!notools &&
                    <div className={'source-card-tools'}>
                        <div className={'source-card-tool'} onClick={()=>this.deleteFeed(id)}>-</div>
                    </div>
                }
            </div>
        );
    }
}

export default SourceCard;
