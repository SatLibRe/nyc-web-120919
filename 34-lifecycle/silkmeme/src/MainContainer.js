import React from 'react';
import CardItem from './CardItem';
import sampleMemes from './data';
import SearchBar from './SearchBar';
import UploadMemeForm from './UploadMemeForm';

const APIBase = 'http://localhost:3000/api/v1'

// 1. X fetch memes from our API
// 2. Fix pagination + selecting subreddit feature bug

class MainContainer extends React.Component {

  state = {
    startIndex: 0,
    memes: [],
    searchInput: ''
  }

  componentDidMount(){
    fetch(APIBase + '/memes')
      .then(res => res.json())
      .then(memes => {
        this.setState({ memes })
      })
  }

  componentDidUpdate(prevProps){
    if(this.props.subreddit !== prevProps.subreddit){
      console.log('current: ', this.props.subreddit, ' & past: ', prevProps.subreddit)
      this.setState({ startIndex: 0 })
    }
  }

  addNewMeme = (newMeme) => {
    this.setState({ memes: [...this.state.memes, newMeme] })
  }

  handleSearchInput = (event) => {
    this.setState({ searchInput: event.target.value })
  }

  handlePageChange = (type) => {
    if (type === 'prev' && this.state.startIndex !== 0) {
      this.setState({ startIndex: this.state.startIndex - 18 })
    } else if (type === 'next' && this.state.startIndex + 18 < this.state.memes.length) {
      this.setState({ startIndex: this.state.startIndex + 18 })
    }
  }

  render() {

    let filteredMemes = this.state.memes.filter(item => {
      if (this.props.subreddit === 'featured') {
        return true
      } else {
        return item.subreddit === this.props.subreddit
      }
    }).filter( item => item.title.includes(this.state.searchInput))

    let memeCards = filteredMemes
      .slice(this.state.startIndex, this.state.startIndex + 18)
      .map((memeInfo, index) =>
        <CardItem
          key={index}
          memeInfo={memeInfo} />
      )

    return (
      <div className="main-container">
        <UploadMemeForm addNewMeme={this.addNewMeme} />
        <SearchBar searchInput={this.state.searchInput} handleSearchInput={this.handleSearchInput} />
        <h1 className="main-title">{this.props.subreddit}!!!!</h1>
        <div className="meme-container"> {memeCards} </div>
        <div className="page-nav">
          <button onClick={() => this.handlePageChange('prev')}>Previous</button>
          <button onClick={() => this.handlePageChange('next')}>Next</button>
        </div>
      </div>
    )
  }
}

export default MainContainer;