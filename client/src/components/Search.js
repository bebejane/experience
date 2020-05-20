import React, { Component } from "react";
import SearchCard from "./SearchCard";
import {AiOutlineLoading} from 'react-icons/ai'
import './Search.css'

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            term:props.term,
            loading:false,
            url:'',
            matches: []
        };
        this.formRef = React.createRef();
        this.urlRef = React.createRef();
    }
    onClick(url){
        this.setState({loading:false, matches:[], url:''})
        this.props.onClick(url)
    }
    onSubmit(e){
        e.preventDefault()
        this.setState({loading:'Loading search'})
        fetch('http://localhost:3001/api/search/'+encodeURIComponent(this.state.url))
            .then(res => res.json())
            .then(res => {
                this.setState({ matches: res.google })
            })
            .catch(err => console.error(err))
            .then(()=>this.setState({loading:false}))
    }
    onChange(e){
        this.setState({[e.target.id]: e.target.value });
    }
    refresh(){

    }
    componentDidMount() {

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return nextProps
    }

    render() {
        const {matches, loading} = this.state

        return (
            <div className={'search-container'}>
                <form ref={this.formRef} onSubmit={(e)=>this.onSubmit(e)}>
                    <input
                        className={'form-add'}
                        placeholder="Add blog..."
                        ref={this.urlRef}
                        onChange={(e)=>this.onChange(e)}
                        value={this.state.url}
                        autoComplete="off"
                        type="text"
                        id="url"
                    />
                </form>
                <div className={'search-result'}>
                    {loading && <div className={'search-loading'}><AiOutlineLoading className='icon-spin'/></div>}
                    {!loading && matches.map((m, idx)=>
                        <SearchCard
                            key={idx}
                            site={m}
                            title={m.title}
                            link={m.link}
                            onClick={()=>this.onClick(m.link)}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default Search;
