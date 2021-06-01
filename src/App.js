import { Component } from 'react';
import './App.css';
import { Offline, Online } from "react-detect-offline";


class App extends Component{

  constructor(props){
    super(props);
    this.state={
      isScrolled:false,
      index:0,
      api:["http://www.mocky.io/v2/59ac28a9100000ce0bf9c236","http://www.mocky.io/v2/59ac293b100000d60bf9c239"],
      items:[],
      isLoaded:false,
      bottomSheet:false,
      value:-1
    }
  }

  
toggleBottomSheet () {
  let obj = (this.state.bottomSheet) ? { 'bottomSheet': false } : { 'bottomSheet': true }
  this.setState(obj)
}
  addData=()=>{
    this.setState({
      isScrolled:true
    })

    if(this.state.index<this.state.api.length)
    {
      this.setState({
        isLoaded:false,
      })
      var index=this.state.index
      var url=this.state.api[index];
        fetch(url).then(res=>res.json())
        .catch(error => {this.setState
          ({
            items:localStorage.getItem("posts")})
          })
      .then(json=>{
        this.setState({
          isLoaded:true,
          items:this.state.items.concat(json["posts"]),
          index:index+1
        })
        localStorage.setItem("posts", this.state.items);
      });
    }

    setTimeout( ()=> { this.setState({
      isScrolled:false
    })}, 1000);
   };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll, false);
  }
  onScroll = () => {
    if(this.state.isScrolled===false)
    {
    if (this.hasReachedBottom()) {
      this.addData();
    }
  }
  };

  sortByDate =()=> {
    var items = this.state.items
    console.log(items)
      let newPostList = items.sort((a, b) => a.views < b.views)
    console.log(newPostList)
    this.setState({
      items: newPostList
    })
  }

  hasReachedBottom() {
    return (
            (window.innerHeight + window.scrollY) > document.body.offsetHeight
    )
  }
  componentDidMount(){
    fetch('http://www.mocky.io/v2/59b3f0b0100000e30b236b7e').then(res=>res.json())
    .then(json=>{
      this.setState({
        isLoaded:true,
        items:json["posts"]
      })
        localStorage.setItem("posts", this.state.items);
    })
   
    window.addEventListener("scroll", this.onScroll, false);
  }
  render(){
    var {isLoaded,items}=this.state;
      return (
        <div className="App">
            <Online>
            {!isLoaded &&
              <h2 className="green">Loading...</h2>
            }
            {isLoaded &&
              <div>
          <h2 className="green">Feed Page - Online</h2>
          <button onClick={this.sortByDate}>Order by date</button>

              <div className="box">
                {items.map(item=>(
                        <div className="card" key={items.indexOf(item)}>
                          <img alt={item.event_name}src={item.thumbnail_image} className="image"/>
                          <div className="name">{item.event_name}</div>
                          <div className="date">Date: {item.event_date}</div>
                          <div className="details"><span>{item.views} Views, {item.likes} Likes,  {item.shares} Shares</span></div>
                        </div>
                  ))};
                </div></div>
          }
          </Online>
          <Offline>
            <h2 className="red">Feed Page - Currently Offline</h2>
            <div className="box">
                {items&&items.map(item=>(
                        <div className="card" key={items.indexOf(item)}>
                          <img alt={item.event_name}src={item.thumbnail_image} className="image"/>
                          <div className="name">{item.event_name}</div>
                          <div className="date">Date: {item.event_date}</div>
                          <div className="details"><span>{item.views} Views, {item.likes} Likes,  {item.shares} Shares</span></div>
                        </div>
                  ))};
                </div>
          </Offline>
          </div>
      );
    }
   
  }  

export default App;
